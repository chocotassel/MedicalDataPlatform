import React, { useEffect, useState, useRef } from 'react'

function PolygonCanvas(props) {

  const [canvasStyle, setCanvasStyle] = useState({
    // position: 'absolute',
    // top: 0,
    // left: 0,
  })

  const polygonRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [drawPoint, setDrawPoint] = useState({ a: 0, b: 0 });
  const [triggerRadius, setTriggerRadius] = useState(4);

  const [points, setPoints] = useState([]);
  

  useEffect(() => {
    // draw();
  }, [points]);

  function drawLine(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
  
    while (x1 !== x2 || y1 !== y2) {
      drawPixel(x1, y1);
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
    drawPixel(x2, y2);
  }

  function drawPixel(a, b) {
    const flag = props.pen
    // 绘制像素点
    switch (viewMsg.type) {
      case 1:
        props.drawImage[props.pointPos.x][a][b] = flag;
        break;
      case 2:
        props.drawImage[a][props.pointPos.y][b] = flag;
        break;
      case 3:
        props.drawImage[a][b][props.pointPos.z] = flag;
        break;
      default:
        break;
    }
  }

  function handleMouseDown(event) {
    const canvas = polygonRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;
    if (points.length >= 2 && x < points[0].x + triggerRadius && x > points[0].x - triggerRadius && y < points[0].y + triggerRadius && y > points[0].y - triggerRadius) {
      setDrawing(false);
      setPoints([]);
      setCanvasStyle(prev => ({
        ...prev,
        cursor: 'default',
      }))
      return;
    }
    setDrawing(true);

    // 添加点
    setPoints((prevPoints) => [...prevPoints, { x, y }]);
    setDrawPoint({ a: x, b: y });
  }

  function handleMouseMove(event) {
    if (drawing) {
      const canvas = polygonRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 绘制多边形
      if (points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }

      // 绘制点
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, triggerRadius, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.beginPath();
      ctx.moveTo(drawPoint.a, drawPoint.b);
      ctx.lineTo(x, y);
      ctx.stroke();

      // 触碰到第一个点
      if (points.length >= 2 && x < points[0].x + triggerRadius && x > points[0].x - triggerRadius && y < points[0].y + triggerRadius && y > points[0].y - triggerRadius) {
        setCanvasStyle(prev => ({
          ...prev,
          cursor: 'pointer',
        }))
      }
    }
  }


  return (
    <canvas
      ref={polygonRef}
      width={500}
      height={300}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{ ...canvasStyle, border: "1px solid black" }}
    >
      Your browser does not support the canvas element.
    </canvas>
  )
}


export default PolygonCanvas