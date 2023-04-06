import React, { useEffect, useState, useRef } from 'react'
import CrossCanvas from '../../components/CrossCanvas';
import DrawCanvas from '../../components/DrawCanvas';
import PolygonCanvas from '../../components/PolygonCanvas';
import RangingCanvas from '../../components/RangingCanvas';
import { useDispatch, useSelector } from 'react-redux';
import { setX, setY, setZ } from '../../store/modules/pointPosState';

import { RGB } from '/src/utils/RGB';

function View(props) {
  // props
  const viewMsg = props.viewMsg;

  // redux
  const pointPos = useSelector((state) => state.pointPos);
  const tool = useSelector((state) => state.tool);
  const dispatch = useDispatch();


  const imgRef = useRef(null);
  const [canvasStyle, setCanvasStyle] = useState({
    position: 'absolute',
    top: 0,
    left: 0,
  })


  // 设置鼠标样式
  useEffect(() => {
    const { type, size, color } = tool;
    const rgb = RGB.createWithHex(color)
    let cursor = type ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size*2}" height="${size*2}"><circle cx="${size}" cy="${size}" r="${size/2}" fill="none" stroke="${type == 1 ? rgb.toRGB() : 'white'}" stroke-width="2"/></svg>') ${size} ${size}, auto` : 'crosshair';
    
    if (type == 3) {
      cursor = 'default';
    }
    setCanvasStyle(prevState => ({
      ...prevState,
      cursor: cursor,
    }))
  }, [tool.type, tool.size, tool.color])


  function handleScroll(event) {
    switch (viewMsg.type) {
      case 1:
        dispatch(setX((pointPos.x + (event.deltaY > 0 ? 1 : -1)) < 0 ? 0 : (pointPos.x + (event.deltaY > 0 ? 1 : -1)) > viewMsg.depth - 1 ? viewMsg.depth - 1 : (pointPos.x + (event.deltaY > 0 ? 1 : -1))))
        break;
      case 2:
        dispatch(setY((pointPos.y + (event.deltaY > 0 ? 1 : -1)) < 0 ? 0 : (pointPos.y + (event.deltaY > 0 ? 1 : -1)) > viewMsg.depth - 1 ? viewMsg.depth - 1 : (pointPos.y + (event.deltaY > 0 ? 1 : -1))))
        break;
      case 3:
        dispatch(setZ((pointPos.z + (event.deltaY > 0 ? 1 : -1)) < 0 ? 0 : (pointPos.z + (event.deltaY > 0 ? 1 : -1)) > viewMsg.depth - 1 ? viewMsg.depth - 1 : (pointPos.z + (event.deltaY > 0 ? 1 : -1))))
        break;
      default:
        console.log('error', viewMsg.type);
        break;
    }
    event.preventDefault();
  };


  // 加载切片
  useEffect(() => {
    if ( props.niftiImage != null && props.drawImage != null) {

      const { niftiImage, drawImage } = props;
      const { width, height, displayWidth, displayHeight, type } = props.viewMsg;
      
      const ctx = imgRef.current.getContext('2d');
      const imageData1 = ctx.createImageData(width, height);
      imgRef.current.width = displayWidth;
      imgRef.current.height = displayHeight;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");

      for (let a = 0; a < width; a++) {
        for (let b = 0; b < height; b++) {
          let value = null;
          switch (type) {
            case 1:
              value = niftiImage[pointPos.x][a][b];
              break;
            case 2:
              value = niftiImage[a][pointPos.y][b];
              break;
            case 3:
              value = niftiImage[a][b][pointPos.z];
              break;
            default:
              break;
          }
          const alpha = 255;
          const rgb = RGB.mapIntegerToColor(value, tool.contrast);

          imageData1.data[(a + b * width) * 4 + 0] = rgb.r;
          imageData1.data[(a + b * width) * 4 + 1] = rgb.g;
          imageData1.data[(a + b * width) * 4 + 2] = rgb.b;
          imageData1.data[(a + b * width) * 4 + 3] = alpha;
        }
      }
      tempCtx.putImageData(imageData1, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, displayWidth, displayHeight);
    }
  }, [props.niftiImage, tool.type, tool.contrast, pointPos.x, pointPos.y, pointPos.z, props.viewMsg.displayWidth, props.viewMsg.displayHeight])



  return (
    <div style={props.viewStyle}>
      <CrossCanvas   drawImage={props.drawImage} viewMsg={props.viewMsg} canvasStyle={canvasStyle} handleScroll={handleScroll} />
      <DrawCanvas    drawImage={props.drawImage} viewMsg={props.viewMsg} canvasStyle={canvasStyle} handleScroll={handleScroll} />
      <PolygonCanvas drawImage={props.drawImage} viewMsg={props.viewMsg} canvasStyle={canvasStyle} handleScroll={handleScroll} setCanvasStyle={setCanvasStyle} />
      <RangingCanvas drawImage={props.drawImage} viewMsg={props.viewMsg} canvasStyle={canvasStyle} handleScroll={handleScroll} setCanvasStyle={setCanvasStyle} />
      <canvas ref={imgRef} >
        Your browser does not support the canvas element.
      </canvas>
    </div>
  )
}

export default View