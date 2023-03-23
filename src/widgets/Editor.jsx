import React, { useEffect, useRef, useState } from 'react'
import { Slider, Select } from 'antd';
import * as nifti from 'nifti-reader-js';

import MainView from './Editor/MainView'
import View from './Editor/View'

import { useDispatch, useSelector } from 'react-redux';
import { setXSize, setYSize, setZSize, setRate } from '../store/modules/modelSizeState';

function Editor() {
  // redux
  const pointPos = useSelector((state) => state.pointPos);
  const modelSize = useSelector((state) => state.modelSize);
  const dispatch = useDispatch();

  // const src = '/src/assets/0b2be9e0-886b-4144-99f0-8bb4c6eaa848.nii'
  const src = '/src/assets/submit/0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.nii/0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.nii'
  const isMountedRef = useRef(false);

  const [niftiImage, setNiftiImage] = useState(null);
  const [drawImage, setDrawImage] = useState(null);
  const [size, setSize] = useState({ x: 0, y: 0, z: 0 });


  const [topViewMsg, setTopViewMsg]     = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  const [leftViewMsg, setLeftViewMsg]   = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  const [frontViewMsg, setFrontViewMsg] = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  

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
        dispatch(setXSize(res.xSize));
        dispatch(setYSize(res.ySize));
        dispatch(setZSize(res.zSize));
        dispatch(setRate(res.rate))

        setNiftiImage(res.niftiImage);
        setDrawImage(res.drawImage)
        setSize({ x: res.xSize, y: res.ySize, z: res.zSize});

        setTopViewMsg({   width: res.xSize, height: res.ySize, displayHeight: res.ySize           , type: 3, depth: res.zSize });
        setLeftViewMsg({  width: res.ySize, height: res.zSize, displayHeight: res.zSize * res.rate, type: 1, depth: res.xSize });
        setFrontViewMsg({ width: res.xSize, height: res.zSize, displayHeight: res.zSize * res.rate, type: 2, depth: res.ySize });
      })

    }
  }, [])

// 定义样式，四宫格
  const [editorStyle, setEditorStyle] = useState({
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: `
      "top left"
      "front left"
    `,
    padding: '10px',
  });

  // 定义子组件样式
  const [viewStyle, setViewStyle] = useState({
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    border: '1px solid #000',
  });


  return (
    <div style={{...editorStyle}}>
      <MainView viewStyle={viewStyle} />
      <View viewStyle={viewStyle} niftiImage={niftiImage} drawImage={drawImage} viewMsg={topViewMsg}   />
      <View viewStyle={viewStyle} niftiImage={niftiImage} drawImage={drawImage} viewMsg={leftViewMsg}  />
      <View viewStyle={viewStyle} niftiImage={niftiImage} drawImage={drawImage} viewMsg={frontViewMsg} />
    </div>
  )
}

export default Editor