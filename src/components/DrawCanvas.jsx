import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setX, setY, setZ } from '../store/modules/pointPosState';
import { RGB } from '../utils/RGB';

function CrossCanvas(props) {
  // props
  const viewMsg = props.viewMsg;

  // redux
  const pointPos = useSelector((state) => state.pointPos);
  const tool = useSelector((state) => state.tool);
  const { rate } = useSelector((state) => state.modelSize);
  const scaleFactor = useSelector((state) => state.scaleFactor);
  const dispatch = useDispatch();



  // 鼠标绘制图像
  const drawRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [drawPoint, setDrawPoint] = useState({ a: 0, b: 0 });


  useEffect(() => {
    if(tool.type !== 1 && tool.type != 2) return;
    const { drawImage } = props;
    const { width, height, displayWidth, displayHeight, type } = props.viewMsg;

    const ctx = drawRef.current.getContext("2d");
    const imageData2 = ctx.createImageData(width, height);
    drawRef.current.width = displayWidth;
    drawRef.current.height = displayHeight;

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
    ctx.clearRect(0, 0, drawRef.current.width, drawRef.current.height);
    ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, displayWidth, displayHeight);
    ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, displayWidth, displayHeight);
    ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, displayWidth, displayHeight);

  }, [props.drawImage, drawing, drawPoint, viewMsg, rate, pointPos.x, pointPos.y, pointPos.z, tool.type, tool.color, tool.size]);




  // 扫描线填充算法
  function drawSolidCircle(x0, y0, radius) {
    for (let y = -radius; y <= radius; y++) {
      const x = Math.round(Math.sqrt(radius * radius - y * y));
      drawLine(x0 - x, y0 + y, x0 + x, y0 + y);
    }
  }
  function drawLine(x1, y1, x2, y2) {
    // 在两个点之间绘制线段
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
  
    while (true) {
      drawPixel(x1, y1);
  
      if (x1 === x2 && y1 === y2) {
        break;
      }
      
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }
  function drawPixel(a, b) {
    const flag = tool.type == 1 ? 1 : 0;
    a = Math.floor(a > viewMsg.width - 1 ? viewMsg.width - 1 : a < 0 ? 0 : a);
    b = Math.floor(b > viewMsg.height - 1 ? viewMsg.height - 1 : b < 0 ? 0 : b);
    // 绘制像素点
    switch (viewMsg.type) {
      case 1:
        props.drawImage[pointPos.x][a][b] = flag;
        break;
      case 2:
        props.drawImage[a][pointPos.y][b] = flag;
        break;
      case 3:
        props.drawImage[a][b][pointPos.z] = flag;
        break;
      default:
        break;
    }
  }

  
  function drawParallelLine(x1, y1, x2, y2, r) {
    // 计算两点间的距离
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // 计算两点连线的单位向量
    const directionX = (x2 - x1) / distance;
    const directionY = (y2 - y1) / distance;

    // 计算平行线的两个端点坐标
    const offsetX = r * directionY;
    const offsetY = r * directionX;
    const p1 = [x1 + offsetX, y1 - offsetY];
    const p2 = [x1 - offsetX, y1 + offsetY];
    const p3 = [x2 - offsetX, y2 + offsetY];
    const p4 = [x2 + offsetX, y2 - offsetY];

    // 遍历矩形区域并填充像素
    const minX = Math.floor(Math.min(p1[0], p2[0], p3[0], p4[0]));
    const maxX = Math.ceil(Math.max(p1[0], p2[0], p3[0], p4[0]));
    const minY = Math.floor(Math.min(p1[1], p2[1], p3[1], p4[1]));
    const maxY = Math.ceil(Math.max(p1[1], p2[1], p3[1], p4[1]));
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        // 判断当前像素是否在矩形区域内
        if (isPointInRectangle(x, y, p1, p2, p3, p4)) {
          // 绘制当前像素
          drawPixel(x, y);
        }
      }
    }
  }

  function crossProduct(x1, y1, x2, y2) {
    return x1 * y2 - x2 * y1;
  }

  function isPointInRectangle(x, y, p1, p2, p3, p4) {
    // 依次计算点 P 与四边形的四条边的位置关系
    const v0 = crossProduct(p2[0] - p1[0], p2[1] - p1[1], x - p1[0], y - p1[1]);
    const v1 = crossProduct(p3[0] - p2[0], p3[1] - p2[1], x - p2[0], y - p2[1]);
    const v2 = crossProduct(p4[0] - p3[0], p4[1] - p3[1], x - p3[0], y - p3[1]);
    const v3 = crossProduct(p1[0] - p4[0], p1[1] - p4[1], x - p4[0], y - p4[1]);

    // 如果点 P 在四条边的同侧，则点 P 在四边形内部
    return (v0 >= 0 && v1 >= 0 && v2 >= 0 && v3 >= 0) || (v0 <= 0 && v1 <= 0 && v2 <= 0 && v3 <= 0);
  }



  
      
  
  
  function handleDrawMouseDown(event) {
    let a = event.nativeEvent.offsetX / scaleFactor;
    let b = viewMsg.type == 3 ? event.nativeEvent.offsetY / scaleFactor : Math.round(event.nativeEvent.offsetY / scaleFactor / rate);
    drawSolidCircle(a, b, tool.size);
    setDrawPoint({ a, b });
    setDrawing(true);
  }

  function handleDrawMouseUp() {
    setDrawing(false);
  }

  
  function handleDrawMouseMove(event) {
    if (drawing) {
      let a = event.nativeEvent.offsetX / scaleFactor;
      let b = viewMsg.type == 3 ? event.nativeEvent.offsetY / scaleFactor : Math.round(event.nativeEvent.offsetY / scaleFactor / rate);
      drawSolidCircle(a, b, tool.size);
      setDrawPoint(prev => {
        drawParallelLine(a, b, prev.a, prev.b, tool.size);
        return { a, b };
      });
    }
  }


  // 滚轮事件
  useEffect(() => {
    const canvas = drawRef.current;
    canvas.addEventListener("wheel", props.handleScroll, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", props.handleScroll, { passive: false });
    };
  }, [viewMsg, pointPos.x, pointPos.y, pointPos.z, tool.type]);


  return (
    <canvas
      ref={drawRef}
      width={viewMsg.width}
      height={viewMsg.displayHeight}
      onMouseDown={handleDrawMouseDown}
      onMouseUp={handleDrawMouseUp}
      onMouseMove={handleDrawMouseMove}
      style={{ ...props.canvasStyle, display: tool.type == 1 || tool.type == 2 || tool.type == 3 ? 'block' : 'none' }}
    >
      Your browser does not support the canvas element. DrawCanvas
    </canvas>
  );
}

export default CrossCanvas;
