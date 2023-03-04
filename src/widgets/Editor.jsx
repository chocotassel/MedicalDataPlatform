import React, { useEffect, useRef, useState } from 'react'
import { Slider, Switch } from 'antd';
import * as nifti from 'nifti-reader-js';

import MainView from './Editor/MainView'
import TopView from './Editor/TopView'
import LeftView from './Editor/LeftView'
import FrontView from './Editor/FrontView'

function Editor() {

  const src = '/src/assets/test.nii'
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

        // 读取NIfTI文件的图像数据
        const imageData = nifti.readImage(header, arrayBuffer);

        // 将ArrayBuffer类型的图像数据转换为Int16Array类型的图像数据
        const imageTypedArray = new Int16Array(imageData);
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

        return {niftiImage, xSize, ySize, zSize};
      }).then(res => {
        setNiftiImage(res.niftiImage);
        setXSize(res.xSize);
        setYSize(res.ySize);
        setZSize(res.zSize);
      })

    }
  }, [])

  return (
    <div className='min-h-full flex-1 grid grid-cols-2'>
      {/* <MainView/> */}
      <div>
        X<Slider max={xSize-1} defaultValue={0} onChange={value => setX(value)}/>
        Y<Slider max={ySize-1} defaultValue={0} onChange={value => setY(value)} />
        Z<Slider max={zSize-1} defaultValue={0} onChange={value => setZ(value)} />
      </div>
      <TopView   niftiImage={niftiImage} xSize={xSize} ySize={ySize} z={z}/>
      <LeftView  niftiImage={niftiImage} ySize={ySize} zSize={zSize} x={x}/>
      <FrontView niftiImage={niftiImage} xSize={xSize} zSize={zSize} y={y}/>
    </div>
  )
}

export default Editor