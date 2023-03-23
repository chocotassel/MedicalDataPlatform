import React, { useEffect, useState, useRef } from 'react'
import CrossCanvas from '../../components/CrossCanvas';
import DrawCanvas from '../../components/DrawCanvas';
import PolygonCanvas from '../../components/PolygonCanvas';
import { useDispatch, useSelector } from 'react-redux';
import { setX, setY, setZ } from '../../store/modules/pointPosState';

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
    let curser = type ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size*2}" height="${size*2}"><circle cx="${size}" cy="${size}" r="${size - 1}" fill="none" stroke="${type == 1 ? color : 'white'}" stroke-width="2"/></svg>') ${size} ${size}, auto` : 'crosshair';
    if (type == 3) {
      curser = 'default';
    }
    setCanvasStyle(prevState => ({
      ...prevState,
      cursor: curser,
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
      const { width, height, displayHeight, type } = props.viewMsg;
      
      const ctx1 = imgRef.current.getContext('2d');
      const imageData1 = ctx1.createImageData(width, height);
      imgRef.current.width = width;
      imgRef.current.height = displayHeight;
      // console.log(viewMsg);

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");


      for (let a = 0; a < width; a++) {
        for (let b = 0; b < height; b++) {
          let value1 = null;
          switch (viewMsg.type) {
            case 1:
              value1 = niftiImage[pointPos.x][a][b];
              break;
            case 2:
              value1 = niftiImage[a][pointPos.y][b];
              break;
            case 3:
              value1 = niftiImage[a][b][pointPos.z];
              break;
            default:
              break;
          }
          const alpha = 255;
          // const grayValue1 = value1 & 0xff 
          // const grayValue1 = (value1 + 32768) % 256 * 255 % 256
          const grayValue1 = value1 * 255 % 256;
          imageData1.data[(a + b * width) * 4 + 0] = grayValue1;
          imageData1.data[(a + b * width) * 4 + 1] = grayValue1;
          imageData1.data[(a + b * width) * 4 + 2] = grayValue1;
          imageData1.data[(a + b * width) * 4 + 3] = alpha;
        }
      }
      tempCtx.putImageData(imageData1, 0, 0);
      if (type !== 3) ctx1.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, displayHeight);
      else ctx1.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);
      
    }
  }, [props.niftiImage, tool.type, pointPos.x, pointPos.y, pointPos.z])



  return (
    <div style={props.viewStyle}>
      <canvas ref={imgRef} >
        Your browser does not support the canvas element.
      </canvas>
      <CrossCanvas   drawImage={props.drawImage} viewMsg={props.viewMsg} canvasStyle={canvasStyle} handleScroll={handleScroll} />
      <DrawCanvas    drawImage={props.drawImage} viewMsg={props.viewMsg} canvasStyle={canvasStyle} handleScroll={handleScroll} />
      <PolygonCanvas drawImage={props.drawImage} viewMsg={props.viewMsg} canvasStyle={canvasStyle} handleScroll={handleScroll} setCanvasStyle={setCanvasStyle} />
    </div>
  )
}

export default View