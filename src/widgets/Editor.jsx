import React, { useEffect, useRef, useState } from 'react'
import { Slider, Switch } from 'antd';
import * as nifti from 'nifti-reader-js';

import MainView from './Editor/MainView'
import TopView from './Editor/TopView'
import LeftView from './Editor/LeftView'
import FrontView from './Editor/FrontView'
import Canvas from '/src/components/Canvas';

function Editor() {

  const src = '/src/assets/0b2be9e0-886b-4144-99f0-8bb4c6eaa848.nii'
  const isMountedRef = useRef(false);

  const [niftiImage, setNiftiImage] = useState(null);
  const [xSize, setXSize] = useState(null);
  const [ySize, setYSize] = useState(null);
  const [zSize, setZSize] = useState(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;

      fetch(src).then(res => res.arrayBuffer()).then(arrayBuffer => {

        // 读取NIfTI文件头信息
        const header = nifti.readHeader(arrayBuffer);
        console.log(header);

        // 读取NIfTI文件的图像数据
        const imageData = nifti.readImage(header, arrayBuffer);

        // 将ArrayBuffer类型的图像数据转换为Int16Array类型的图像数据
        const imageTypedArray = new Int16Array(imageData);
        // console.log(imageTypedArray);

        // console.log(header.affine);
        // // 仿射变换
        // const outputData = transformImageData(imageData, header);
        // console.log(outputData);
        // console.log(header.dims);

        const xSize = header.dims[1];
        const ySize = header.dims[2];
        const zSize = header.dims[3];

        // 将Int16Array类型的图像数据转换为三维数组
        const niftiImage = new Array(xSize);
        for (let x = 0; x < xSize; x++) {
          niftiImage[x] = new Array(ySize);
          for (let y = 0; y < ySize; y++) {
            niftiImage[x][y] = new Array(zSize);
            for (let z = 0; z < zSize; z++) {
              const index = x + y * xSize + z * xSize * ySize;
              niftiImage[x][y][z] = imageTypedArray[index];
            }
          }
        }
        // console.log((niftiImage[0][0][0]& 0xffff).toString(2));

      
        return {niftiImage, xSize, ySize, zSize};
      }).then(res => {
        setNiftiImage(res.niftiImage);
        setXSize(res.xSize);
        setYSize(res.ySize);
        setZSize(res.zSize);
      })

    }
  }, [])


  // // 定义NIfTI图像变换函数
  // function transformNifti(arrayBuffer, affineMatrix) {
  //   // 使用nifti-reader-js库解析arrayBuffer
  //   var nifti = new NiftiReader();
  //   var niftiData = nifti.readHeader(arrayBuffer);
  //   var niftiImage = nifti.readImage(niftiData, arrayBuffer);

  //   // 获取图像的空间分辨率和维度信息
  //   var pixDims = niftiData.pixDims.slice(0, 3); // 获取空间分辨率
  //   var dims = niftiData.dims.slice(0, 3); // 获取维度信息

  //   // 创建一个新的空数组，用于存储变换后的图像数据
  //   var transformedImage = new Float32Array(dims[0] * dims[1] * dims[2]);

  //   // 遍历每个像素，并将其坐标乘以affine矩阵
  //   for (var k = 0; k < dims[2]; k++) {
  //     for (var j = 0; j < dims[1]; j++) {
  //       for (var i = 0; i < dims[0]; i++) {
  //         // 将像素坐标转换为物理坐标
  //         var x = (i + 0.5) * pixDims[0];
  //         var y = (j + 0.5) * pixDims[1];
  //         var z = (k + 0.5) * pixDims[2];
  //         var p = [x, y, z, 1]; // 添加齐次坐标

  //         // 将物理坐标乘以affine矩阵
  //         var q = [0, 0, 0, 0];
  //         for (var row = 0; row < 4; row++) {
  //           for (var col = 0; col < 4; col++) {
  //             q[row] += p[col] * affineMatrix[row * 4 + col];
  //           }
  //         }

  //         // 将变换后的物理坐标转换为像素坐标
  //         var i2 = Math.floor(q[0] / pixDims[0] - 0.5);
  //         var j2 = Math.floor(q[1] / pixDims[1] - 0.5);
  //         var k2 = Math.floor(q[2] / pixDims[2] - 0.5);

  //         // 如果像素坐标在图像范围内，则将像素值复制到变换后的图像中
  //         if (i2 >= 0 && i2 < dims[0] && j2 >= 0 && j2 < dims[1] && k2 >= 0 && k2 < dims[2]) {
  //           var idx1 = k * dims[0] * dims[1] + j * dims[0] + i;
  //           var idx2 = k2 * dims[0] * dims[1] + j2 * dims[0] + i2;
  //           transformedImage[idx2] = niftiImage[idx1];
  //         }
  //       }
  //     }
  //   }

  //   // 返回变换后的图像数据
  //   return transformedImage;
  // }

  return (
    <div className='min-h-full flex-1 grid grid-cols-2'>
      {/* <MainView/> */}
      <div>
        X<Slider max={xSize-1} defaultValue={0} onChange={value => setX(value)}/>
        Y<Slider max={ySize-1} defaultValue={0} onChange={value => setY(value)} />
        Z<Slider max={zSize-1} defaultValue={0} onChange={value => setZ(value)} />
        <Canvas />
      </div>
      <TopView   niftiImage={niftiImage} xSize={xSize} ySize={ySize} z={z}/>
      <LeftView  niftiImage={niftiImage} ySize={ySize} zSize={zSize} x={x}/>
      <FrontView niftiImage={niftiImage} xSize={xSize} zSize={zSize} y={y}/>
    </div>
  )
}

export default Editor