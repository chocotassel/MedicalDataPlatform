import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function PolygonCanvas(props) {
  // props
  const viewMsg = props.viewMsg;

  // redux
  const pointPos = useSelector((state) => state.pointPos);
  const tool = useSelector((state) => state.tool);
  const { rate } = useSelector((state) => state.modelSize);
  const isdrawing = useSelector((state) => state.drawing);
  const dispatch = useDispatch();


  const polygonRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [drawPoint, setDrawPoint] = useState({ a: 0, b: 0 });
  const [triggerRadius, setTriggerRadius] = useState(4);

  const [vertices, setVertices] = useState([]);
  


  useEffect(() => {
    if(tool.type !== 3) return;
    const { drawImage } = props;
    const { width, height, displayHeight, type } = props.viewMsg;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    const ctx = polygonRef.current.getContext("2d");
    const imageData2 = ctx.createImageData(width, height);
    polygonRef.current.width = width;
    polygonRef.current.height = displayHeight;

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
        const grayValue = value * 255 % 256

        imageData2.data[(a + b * width) * 4 + 0] = grayValue;
        imageData2.data[(a + b * width) * 4 + 1] = 0;
        imageData2.data[(a + b * width) * 4 + 2] = 0;
        imageData2.data[(a + b * width) * 4 + 3] = value > 0 ? alpha * 0.6 : 0;
      }
    }

    tempCtx.putImageData(imageData2, 0, 0);
    if (viewMsg.type !== 3) {
      ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, displayHeight);
    }
    else ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);

    // 设置画笔大小
    ctx.strokeStyle = tool.color;

  }, [props.drawImage, viewMsg, rate, pointPos.x, pointPos.y, pointPos.z, tool.type, tool.color, tool.size, drawing]);



  // // 扫描线填充算法
  // class Edge {
  //   constructor(yMin, yMax, x, slopeInverse) {
  //     this.yMin = yMin;
  //     this.yMax = yMax;
  //     this.x = x;
  //     this.slopeInverse = slopeInverse;
  //   }
  // }
  // // 构建边表
  // function buildEdgeTable(vertices) {
  //   const edgeTable = new Map();
  
  //   for (let i = 0; i < vertices.length; i++) {
  //     let currentVertex = vertices[i];
  //     let nextVertex = vertices[(i + 1) % vertices.length];
  
  //     if (currentVertex.y === nextVertex.y) {
  //       continue;
  //     }
  
  //     let yMin = Math.min(currentVertex.y, nextVertex.y);
  //     let yMax = Math.max(currentVertex.y, nextVertex.y);
  //     let x = currentVertex.y < nextVertex.y ? currentVertex.x : nextVertex.x;
  //     let slopeInverse = (nextVertex.x - currentVertex.x) / (nextVertex.y - currentVertex.y);
  
  //     const edge = new Edge(yMin, yMax, x, slopeInverse);
  
  //     if (!edgeTable.has(yMin)) {
  //       edgeTable.set(yMin, []);
  //     }
  
  //     edgeTable.get(yMin).push(edge);
  //   }
  
  //   return edgeTable;
  // }
  
  
  // // 更新活动边表
  // function updateAET(aet, y) {
  //   aet = aet.filter(edge => edge.yMax !== y);
  //   aet.forEach(edge => (edge.x = Math.floor(edge.x + edge.slopeInverse)));
  //   return aet;
  // }

  // // 扫描线填充
  // function scanLineFill(vertices) {
  //   vertices = vertices.map(vertex => ({ x: Math.floor(vertex.x), y: Math.floor(vertex.y) }));

  //   const edgeTable = buildEdgeTable(vertices);
  //   let aet = [];

  //   let yMin = Math.min(...Array.from(edgeTable.keys()));
  //   let yMax = Math.max(...Array.from(edgeTable.keys()));
  
  //   for (let y = yMin; y <= yMax; y++) {
  //     if (edgeTable.has(y)) {
  //       aet = aet.concat(edgeTable.get(y));
  //     }
  
  //     aet.sort((a, b) => a.x - b.x);
  
  //     for (let i = 0; i < aet.length; i += 2) {
  //       let xStart = Math.ceil(aet[i].x);
  //       let xEnd = Math.floor(aet[i + 1].x);
  
  //       for (let x = xStart; x <= xEnd; x++) {
  //         drawPixel(x, y);
  //       }
  //     }
  
  //     aet = updateAET(aet, y);
  //   }
  // }

  function drawPixel(a, b) {
    const flag = tool.type
    a = Math.floor(a);
    b = Math.floor(b);
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

    // 绘制多边形边框
    const ctx = polygonRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.stroke();

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


  return (
    <canvas
      ref={polygonRef}
      width={viewMsg.width}
      height={viewMsg.displayHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{ ...props.canvasStyle, border: "1px solid black", display: tool.type == 3 ? 'block' : 'none' }}
    >
      Your browser does not support the canvas element.
    </canvas>
  )
}


export default PolygonCanvas