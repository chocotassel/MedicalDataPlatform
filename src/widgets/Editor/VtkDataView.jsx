import React, { useEffect, useRef } from 'react';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';


import * as nifti from 'nifti-reader-js';

async function loadNiftiFile(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const rawData = new DataView(arrayBuffer);

  // if (!nifti.isCompressed(arrayBuffer)) {
  //   throw new Error('The NIfTI file is not compressed.');
  // }

  // const decompressedData = nifti.decompress(arrayBuffer);
  const niftiHeader = nifti.readHeader(arrayBuffer);
  const niftiImage = nifti.readImage(niftiHeader, arrayBuffer);

  return {
    header: niftiHeader,
    image: niftiImage,
  };
}


function VtkDataView({ url }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!url || !containerRef.current) {
      return;
    }

    // 创建vtk.js渲染窗口、渲染器、体积数据映射器、体积对象等
    const renderWindow = vtkRenderWindow.newInstance();
    const openGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    renderWindow.addView(openGLRenderWindow);

    const container = containerRef.current;
    openGLRenderWindow.setContainer(container);
    const { width, height } = container.getBoundingClientRect();
    openGLRenderWindow.setSize(width, height);

    const renderer = vtkRenderer.newInstance();
    renderWindow.addRenderer(renderer);

    const volume = vtkVolume.newInstance();
    const mapper = vtkVolumeMapper.newInstance();

    // 设置体积对象的映射器
    volume.setMapper(mapper); 

    // 加载NIfTI文件并将其转换为vtkImageData格式
    loadNiftiFile(url)
    .then(({ header, image }) => {
      const imageData = niftiImageDataToVtkImageData(header, image);
      mapper.setInputData(imageData);
      renderer.addVolume(volume);

      // 自适应窗口大小
      renderer.resetCamera();
      renderWindow.render();

      const resizeObserver = new ResizeObserver(() => {
        const { width, height } = container.getBoundingClientRect();
        openGLRenderWindow.setSize(width, height);
        renderWindow.render();
      });

      // 监听窗口大小变化事件
      resizeObserver.observe(container);

      return () => {
        resizeObserver.unobserve(container);
        renderer.removeVolume(volume);
        openGLRenderWindow.setContainer(null);
      };
    })
    .catch((error) => {
      console.error('Error loading NIfTI file:', error);
    });

    function niftiImageDataToVtkImageData(header, image) {
      const array = new Uint8Array(image);
      const imageData = vtkImageData.newInstance();
      imageData.setSpacing(header.pixDims.slice(1, 4));
      imageData.setExtent(0, header.dims[1] - 1, 0, header.dims[2] - 1, 0, header.dims[3] - 1);
    
      const scalarArray = vtkDataArray.newInstance({
        name: 'Scalars',
        numberOfComponents: 1,
        values: array,
      });
      imageData.getPointData().setScalars(scalarArray);
    
      return imageData;
    }
}, [url]);

return (
  <div
    ref={containerRef}
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}
  />
);
}

export default VtkDataView;
