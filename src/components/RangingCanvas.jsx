import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { RGB } from '/src/utils/RGB';


function PolygonCanvas(props) {
  // props
  const viewMsg = props.viewMsg;

  // redux
  const pointPos = useSelector((state) => state.pointPos);
  const tool = useSelector((state) => state.tool);
  const { rate } = useSelector((state) => state.modelSize);
  const scaleFactor = useSelector((state) => state.scaleFactor);
  const dispatch = useDispatch();


  const rangingRef = useRef(null);

  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  


  useEffect(() => {
    if(tool.type !== 4) return;
    const { drawImage } = props;
    const { width, height, displayWidth, displayHeight, type } = props.viewMsg;

    const ctx = rangingRef.current.getContext("2d");
    const imageData2 = ctx.createImageData(width, height);
    rangingRef.current.width = displayWidth;
    rangingRef.current.height = displayHeight;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    for (let a = 0; a < width; a++) {
      for (let b = 0; b < height; b++) {
        let value = null;
        switch (type) {
          case 1:
            value = drawImage[pointPos.x][a][b];
            break;
          case 2:
            value = drawImage[a][pointPos.y][b];
            break;
          case 3:
            value = drawImage[a][b][pointPos.z];
            break;
          default:
            break;
        }
        const alpha = 255;
        const color = RGB.createWithHex(tool.color);

        imageData2.data[(a + b * width) * 4 + 0] = color.r;
        imageData2.data[(a + b * width) * 4 + 1] = color.g;
        imageData2.data[(a + b * width) * 4 + 2] = color.b;
        imageData2.data[(a + b * width) * 4 + 3] = value > 0 ? alpha * 0.6 : 0;
      }
    }

    tempCtx.putImageData(imageData2, 0, 0);
    ctx.clearRect(0, 0, rangingRef.current.width, rangingRef.current.height);
    ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, displayWidth, displayHeight);

    // 设置画笔大小
    ctx.strokeStyle = tool.color;

  }, [props.drawImage, viewMsg, rate, pointPos.x, pointPos.y, pointPos.z, tool.type, tool.color, tool.size]);



  // 鼠标事件
  const handleMouseDown = (e) => {
    const rect = rangingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleMouseMove = (e) => {
    if (!currentLine) return;
    const rect = rangingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine({ ...currentLine, x2: x, y2: y });
  };

  const handleMouseUp = () => {
    if (!currentLine) return;
    setLines([...lines, currentLine]);
    setCurrentLine(null);
  };

  // 画线
  const drawLines = () => {
    if (!rangingRef.current) return;
    const ctx = rangingRef.current.getContext('2d');
    ctx.clearRect(0, 0, rangingRef.current.width, rangingRef.current.height);

    const drawLineAndDistance = (line) => {
      const { x1, y1, x2, y2 } = line;
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const labelX = (x1 + x2) / 2;
      const labelY = (y1 + y2) / 2;
      ctx.font = '14px Arial';
      ctx.fillStyle = tool.color;
      ctx.fillText(`${distance}mm`, labelX, labelY);
    };

    lines.forEach(drawLineAndDistance);
    if (currentLine) {
      drawLineAndDistance(currentLine);
    }

  };


  useEffect(() => {
    drawLines();
  }, [lines, currentLine]);




  // 滚轮事件
  useEffect(() => {
    const canvas = rangingRef.current;
    canvas.addEventListener("wheel", props.handleScroll, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", props.handleScroll, { passive: false });
    };
  }, [viewMsg, pointPos.x, pointPos.y, pointPos.z, tool.type]);


  return (
    <canvas
      ref={rangingRef}
      width={viewMsg.width}
      height={viewMsg.displayHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ ...props.canvasStyle, display: tool.type == 4 ? 'block' : 'none' }}
    >
      Your browser does not support the canvas element. PolygonCanvas
    </canvas>
  )
}


export default PolygonCanvas