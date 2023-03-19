import React, { useEffect, useRef, useState } from 'react'
import { Slider, Select } from 'antd';
import * as nifti from 'nifti-reader-js';

import MainView from './Editor/MainView'
import View from './Editor/View'
import PolygonCanvas from '../components/PolygonCanvas'

function Editor() {

  // const src = '/src/assets/0b2be9e0-886b-4144-99f0-8bb4c6eaa848.nii'
  const src = '/src/assets/submit/0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.nii/0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.nii'
  const isMountedRef = useRef(false);

  const [niftiImage, setNiftiImage] = useState(null);
  const [drawImage, setDrawImage] = useState(null);
  const [size, setSize] = useState({ x: 0, y: 0, z: 0 });
  const [pointPos, setPointPos] = useState({ x: 0, y: 0, z: 0 });
  const [rate, setRate] = useState(1);


  const [topViewMsg, setTopViewMsg]     = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  const [leftViewMsg, setLeftViewMsg]   = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  const [frontViewMsg, setFrontViewMsg] = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  

  const [tool, setTool] = useState(0);
  const handleToolChange = (value) => {
    setTool(value)
  };
  const [pen, setPen] = useState(1);
  const handlePenChange = (value) => {
    setPen(value)
  };
  const [penSize, setPenSize] = useState(8);
  const handlePenSizeChange = (value) => {
    setPenSize(value)
  }
  function uniqueArray(arr) {
    return arr.filter(function(item, index) {
      return arr.indexOf(item) === index;
    });
  }
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;

      fetch(src).then(res => res.arrayBuffer()).then(arrayBuffer => {

        // 读取NIfTI文件头信息
        const header = nifti.readHeader(arrayBuffer);
        console.log(header);

        // 读取NIfTI文件的图像数据
        const imageData = nifti.readImage(header, arrayBuffer);
        console.log(imageData);

        // 将ArrayBuffer类型的图像数据转换为Int16Array类型的图像数据
        const imageTypedArray = new Int16Array(imageData);
        console.log(imageTypedArray);

        // console.log(header.affine);

        const xSize = header.dims[1];
        const ySize = header.dims[2];
        const zSize = header.dims[3];
        // const uniqueArr = [];

        // 将Int16Array类型的图像数据转换为三维数组
        const niftiImage = new Array(xSize);
        const drawImage = new Array(xSize);
        for (let x = 0; x < xSize; x++) {
          niftiImage[x] = new Array(ySize);
          drawImage[x] = new Array(ySize);
          for (let y = 0; y < ySize; y++) {
            niftiImage[x][y] = new Array(zSize);
            drawImage[x][y] = new Array(zSize);
            for (let z = 0; z < zSize; z++) {
              const index = x + y * xSize + z * xSize * ySize;
              niftiImage[x][y][z] = imageTypedArray[index];
              drawImage[x][y][z] = 0;
              // if(niftiImage[x][y][z] > 0 && niftiImage[x][y][z] < 2) {
              //   console.log(niftiImage[x][y][z] & 0xffff);
              // }
              // let a = imageTypedArray[index] > 15 ? imageTypedArray[index] % 16 : imageTypedArray[index];
              // if (!uniqueArr.includes(a)) {
              //   uniqueArr.push(a);
              // }
            }
          }
        }
        // console.log((niftiImage[0][0][0]& 0xffff).toString(2));
        // console.log(uniqueArr)
      
        return {niftiImage, drawImage, xSize, ySize, zSize, rate: header.pixDims[3] / header.pixDims[1]};
      }).then(res => {
        setNiftiImage(res.niftiImage);
        setDrawImage(res.drawImage)
        setSize({ x: res.xSize, y: res.ySize, z: res.zSize});
        setRate(res.rate);

        setTopViewMsg({   width: res.xSize, height: res.ySize, displayHeight: res.ySize           , type: 3, depth: res.zSize });
        setLeftViewMsg({  width: res.ySize, height: res.zSize, displayHeight: res.zSize * res.rate, type: 1, depth: res.xSize });
        setFrontViewMsg({ width: res.xSize, height: res.zSize, displayHeight: res.zSize * res.rate, type: 2, depth: res.ySize });
      })

    }
  }, [])

  


  useEffect(() => {
    console.log(pointPos);
  }, [pointPos])


  return (
    <div className='min-h-full flex-1 grid grid-cols-2'>
      <MainView size={size} pointPos={pointPos} rate={rate} />
      {/* <div>
        X<Slider max={size.x-1} defaultValue={0} onChange={value => setPointPos(prevState => ({ ...prevState, x: value})) }/>
        Y<Slider max={size.y-1} defaultValue={0} onChange={value => setPointPos(prevState => ({ ...prevState, y: value})) } />
        Z<Slider max={size.z-1} defaultValue={0} onChange={value => setPointPos(prevState => ({ ...prevState, z: value})) } />

        <Select
          defaultValue={tool}
          style={{
            width: 120,
          }}
          onChange={handleToolChange}
          options={[
            {
              value: 0,
              label: '坐标',
            },
            {
              value: 1,
              label: '标记',
            },
          ]}
        />
        <Select
          defaultValue={pen}
          style={{
            width: 120,
          }}
          onChange={handlePenChange}
          options={[
            {
              value: 0,
              label: '橡皮',
            },
            {
              value: 1,
              label: '画笔',
            },
            {
              value: 2,
              label: '多边形',
            },
          ]}
        />
        <Select
          defaultValue={penSize}
          style={{
            width: 120,
          }}
          onChange={handlePenSizeChange}
          options={[
            {
              value: 2,
              label: '4',
            },
            {
              value: 4,
              label: '8',
            },
            {
              value: 8,
              label: '16',
            },
            {
              value: 16,
              label: '32',
            },
          ]}
        />
      </div> */}
        {/* <PolygonCanvas tool={tool} /> */}
      <View niftiImage={niftiImage} drawImage={drawImage} viewMsg={topViewMsg}   pointPos={pointPos} setPointPos={setPointPos} tool={tool} pen={pen} rate={rate} penSize={penSize} />
      <View niftiImage={niftiImage} drawImage={drawImage} viewMsg={leftViewMsg}  pointPos={pointPos} setPointPos={setPointPos} tool={tool} pen={pen} rate={rate} penSize={penSize} />
      <View niftiImage={niftiImage} drawImage={drawImage} viewMsg={frontViewMsg} pointPos={pointPos} setPointPos={setPointPos} tool={tool} pen={pen} rate={rate} penSize={penSize} />
    </div>
  )
}

export default Editor