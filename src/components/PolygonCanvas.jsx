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


  const polygonRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [drawPoint, setDrawPoint] = useState({ a: 0, b: 0 });
  const [triggerRadius, setTriggerRadius] = useState(4);

  const [vertices, setVertices] = useState([]);
  


  useEffect(() => {
    if(tool.type !== 3) return;
    const { drawImage } = props;
    const { width, height, displayWidth, displayHeight, type } = props.viewMsg;

    const ctx = polygonRef.current.getContext("2d");
    const imageData2 = ctx.createImageData(width, height);
    polygonRef.current.width = displayWidth;
    polygonRef.current.height = displayHeight;

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
    ctx.clearRect(0, 0, polygonRef.current.width, polygonRef.current.height);
    ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, displayWidth, displayHeight);

    // 设置画笔大小
    ctx.strokeStyle = tool.color;

  }, [props.drawImage, viewMsg, rate, pointPos.x, pointPos.y, pointPos.z, tool.type, tool.color, tool.size, drawing]);




  function drawPixel(a, b) {
    const flag = tool.type
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

  
  function fillPolygon(points) {
    if (points.length < 3) {
      return;
    }
    for (let i = 0; i < points.length; i++) {
      points[i].x = Math.floor(points[i].x / scaleFactor);
      points[i].y = Math.floor(points[i].y / scaleFactor);
    }

    // 扫描线填充算法
    let minY = points[0].y;
    let maxY = minY;

    for (let i = 1; i < points.length; i++) {
      minY = Math.min(minY, points[i].y);
      maxY = Math.max(maxY, points[i].y);
    }

    for (let y = minY; y <= maxY; y++) {
      let intersections = [];

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        if ((p1.y < y && p2.y >= y) || (p2.y < y && p1.y >= y)) {
          const x = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
          intersections.push(x);
        }
      }

      intersections.sort((a, b) => a - b);

      for (let i = 0; i < intersections.length; i += 2) {
        for (let x = intersections[i]; x < intersections[i + 1]; x++) {
          drawPixel(x, y);
        }
      }
    }
  }



  // 鼠标点击事件
  function handleMouseDown(event) {
    const canvas = polygonRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;
    if (vertices.length >= 2 && x < vertices[0].x + triggerRadius && x > vertices[0].x - triggerRadius && y < vertices[0].y + triggerRadius && y > vertices[0].y - triggerRadius) {
      setDrawing(false);
      // scanLineFill(vertices);
      fillPolygon(vertices)
      setVertices([]);
      props.setCanvasStyle(prev => ({
        ...prev,
        cursor: 'default',
      }))
      return;
    }
    setDrawing(true);

    // 添加点
    setVertices((prevVertices) => [...prevVertices, { x, y }]);
    setDrawPoint({ a: x, b: y });
  }

  function handleMouseMove(event) {
    if (drawing) {
      const canvas = polygonRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = tool.color;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 绘制多边形
      if (vertices.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
          ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.stroke();
      }

      // 绘制点
      vertices.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, triggerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = tool.color;
        ctx.fill();
      });

      ctx.beginPath();
      ctx.moveTo(drawPoint.a, drawPoint.b);
      ctx.lineTo(x, y);
      ctx.stroke();

      // 触碰到第一个点
      if (vertices.length >= 2 && x < vertices[0].x + triggerRadius && x > vertices[0].x - triggerRadius && y < vertices[0].y + triggerRadius && y > vertices[0].y - triggerRadius) {
        props.setCanvasStyle(prev => ({
          ...prev,
          cursor: 'pointer',
        }))
      }
    }
  }


  // 滚轮事件
  useEffect(() => {
    const canvas = polygonRef.current;
    canvas.addEventListener("wheel", props.handleScroll, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", props.handleScroll, { passive: false });
    };
  }, [viewMsg, pointPos.x, pointPos.y, pointPos.z, tool.type]);


  return (
    <canvas
      ref={polygonRef}
      width={viewMsg.width}
      height={viewMsg.displayHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{ ...props.canvasStyle, display: tool.type == 3 ? 'block' : 'none' }}
    >
      Your browser does not support the canvas element. PolygonCanvas
    </canvas>
  )
}


export default PolygonCanvas