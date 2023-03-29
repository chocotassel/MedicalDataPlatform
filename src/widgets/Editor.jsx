import React, { useEffect, useRef, useState } from 'react'
import * as nifti from 'nifti-reader-js';
import * as glMatrix from "gl-matrix";
import n2a from '/src/utils/n2a.js'

import MainView from './Editor/MainView'
import VtkDataView from './Editor/VtkDataView'
import View from './Editor/View'

import { useDispatch, useSelector } from 'react-redux';
import { setXSize, setYSize, setZSize, setRate } from '../store/modules/modelSizeState';
import { setScaleFactor } from '../store/modules/scaleFactorState';




function Editor() {
  // redux
  const pointPos = useSelector((state) => state.pointPos);
  const modelSize = useSelector((state) => state.modelSize);
  const scaleFactor = useSelector((state) => state.scaleFactor);
  const dispatch = useDispatch();

  // const src = '/src/assets/0b2be9e0-886b-4144-99f0-8bb4c6eaa848.nii'
  const src = '/src/assets/submit/0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.nii/0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.nii'
  const isMountedRef = useRef(false);

  const [niftiImage, setNiftiImage] = useState(null);
  const [drawImage, setDrawImage] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0, z: 0 });
  const [niftiData, setNiftiData] = useState(null)


  const [topViewMsg, setTopViewMsg]     = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  const [leftViewMsg, setLeftViewMsg]   = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  const [frontViewMsg, setFrontViewMsg] = useState({ width: 0, height: 0, displayHeight: 0, type: 0, depth: 0 });
  

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;

      fetch(src).then(res => res.arrayBuffer()).then(arrayBuffer => {
        // 读取NIfTI文件头信息
        const header = nifti.readHeader(arrayBuffer);

        const xSize = header.dims[1];
        const ySize = header.dims[2];
        const zSize = header.dims[3];

        // 读取NIfTI文件数据信息
        const { niftiImage, drawImage } = n2a.getOriginalArray3D(arrayBuffer)
        
        const dims = header.dims.slice(1, 4);
        const spacing = [header.pixDims[1], header.pixDims[2], header.pixDims[3]];
        const origin = [0, 0, 0];

        const niftiData = {
          data: new Uint8Array(nifti.readImage(header, arrayBuffer)),
          dims,
          spacing,
          origin,
        }
        setNiftiData(niftiData)
      
        return {
          niftiImage, 
          drawImage, 
          xSize, ySize, zSize, 
          rate: header.pixDims[3] / header.pixDims[1], 
          offset: {
            x: Math.abs(header.qoffset_x), 
            y: Math.abs(header.qoffset_y), 
            z: Math.abs(header.qoffset_z),
          },
        };
      }).then(res => {
        dispatch(setXSize(res.xSize));
        dispatch(setYSize(res.ySize));
        dispatch(setZSize(res.zSize));
        dispatch(setRate(res.rate))

        setNiftiImage(res.niftiImage);
        setDrawImage(res.drawImage)
        setOffset(res.offset);

        setTopViewMsg({   width: res.xSize, height: res.ySize, displayWidth: res.xSize * scaleFactor, displayHeight: res.ySize * scaleFactor           , type: 3, depth: res.zSize });
        setLeftViewMsg({  width: res.ySize, height: res.zSize, displayWidth: res.ySize * scaleFactor, displayHeight: res.zSize * scaleFactor * res.rate, type: 1, depth: res.xSize });
        setFrontViewMsg({ width: res.xSize, height: res.zSize, displayWidth: res.xSize * scaleFactor, displayHeight: res.zSize * scaleFactor * res.rate, type: 2, depth: res.ySize });
      })

    }
  }, [])

// 定义样式，四宫格
  const [editorStyle, setEditorStyle] = useState({
    // flex: 1,
    display: 'grid',
    // gridTemplateColumns: '1fr 1fr',
    gridAutoColumns: 'minmax(100px, auto)',
    gridAutoRows: 'minmax(100px, auto)',
    gridTemplateAreas: `
      "top left"
      "front left"
    `,
    gridGap: '10px',
    padding: '10px',
  });

  // 定义子组件样式
  const [viewStyle, setViewStyle] = useState({
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    // border: '1px solid #000',
    boxSize: 'border-box',
  });


  return (
    <div style={{...editorStyle}}>
      <MainView viewStyle={viewStyle} offset={offset} />
      {/* <VtkDataView url={src} /> */}
      <View viewStyle={viewStyle} niftiImage={niftiImage} drawImage={drawImage} viewMsg={topViewMsg}   />
      <View viewStyle={viewStyle} niftiImage={niftiImage} drawImage={drawImage} viewMsg={leftViewMsg}  />
      <View viewStyle={viewStyle} niftiImage={niftiImage} drawImage={drawImage} viewMsg={frontViewMsg} />
    </div>
  )
}

export default Editor