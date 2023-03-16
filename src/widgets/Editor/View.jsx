import React, { useEffect, useState, useRef } from 'react'

function View(props) {
  const imgRef = useRef(null);
  const viewMsg = props.viewMsg;

  const [canvasStyle, setCanvasStyle] = useState({
    position: 'absolute',
    top: 0,
    left: 0,
  })

  useEffect(() => {
    const curser = props.tool ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${props.panSize*2}" height="${props.panSize*2}"><circle cx="${props.panSize}" cy="${props.panSize}" r="${props.panSize - 1}" fill="none" stroke="red" stroke-width="2"/></svg>') ${props.panSize} ${props.panSize}, auto` : 'crosshair';

    setCanvasStyle(prevState => ({
      ...prevState,
      cursor: curser,
    }))
  }, [props.tool, props.panSize])


  // 滚轮事件
  useEffect(() => {
    const canvas = props.tool == 0 ? crossRef.current : drawRef.current;
    
    function handleScroll(event) {
      switch (viewMsg.type) {
        case 1:
          props.setPointPos(prevState => ({ ...prevState, x: (prevState.x + (event.deltaY > 0 ? 1 : -1)) < 0 ? 0 : (prevState.x + (event.deltaY > 0 ? 1 : -1)) > viewMsg.depth - 1 ? viewMsg.depth - 1 : (prevState.x + (event.deltaY > 0 ? 1 : -1)) }));
          break;
        case 2:
          props.setPointPos(prevState => ({ ...prevState, y: (prevState.y + (event.deltaY > 0 ? 1 : -1)) < 0 ? 0 : (prevState.y + (event.deltaY > 0 ? 1 : -1)) > viewMsg.depth - 1 ? viewMsg.depth - 1 : (prevState.y + (event.deltaY > 0 ? 1 : -1)) }));
          break;
        case 3:
          props.setPointPos(prevState => ({ ...prevState, z: (prevState.z + (event.deltaY > 0 ? 1 : -1)) < 0 ? 0 : (prevState.z + (event.deltaY > 0 ? 1 : -1)) > viewMsg.depth - 1 ? viewMsg.depth - 1 : (prevState.z + (event.deltaY > 0 ? 1 : -1)) }));
          break;
        default:
          console.log('error', viewMsg.type);
          break;
      }
      // console.log('handleScroll', viewMsg.type, pointPos);
      event.preventDefault();
    };
    canvas.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleScroll, { passive: false });
    };
  }, [viewMsg, props.pointPos, props.tool]);



  // 加载切片
  useEffect(() => {
    // console.log(props.niftiImage);
    // console.log(viewMsg);
    if ( props.niftiImage != null && props.drawImage != null) {

      const { niftiImage, drawImage, tool } = props;
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


      if(tool === 0) {

        for (let a = 0; a < width; a++) {
          for (let b = 0; b < height; b++) {
            let value1 = null;
            switch (type) {
              case 1:
                value1 = niftiImage[props.pointPos.x][a][b];
                break;
              case 2:
                value1 = niftiImage[a][props.pointPos.y][b];
                break;
              case 3:
                value1 = niftiImage[a][b][props.pointPos.z];
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
      else if(tool === 1) {

        const ctx2 = drawRef.current.getContext("2d");
        const imageData2 = ctx2.createImageData(width, height);
        drawRef.current.width = width;
        drawRef.current.height = displayHeight;

        for (let a = 0; a < width; a++) {
          for (let b = 0; b < height; b++) {
            let value1 = null;
            let value2 = null;
            switch (type) {
              case 1:
                value1 = niftiImage[props.pointPos.x][a][b];
                value2 = drawImage[props.pointPos.x][a][b];
                break;
              case 2:
                value1 = niftiImage[a][props.pointPos.y][b];
                value2 = drawImage[a][props.pointPos.y][b];
                break;
              case 3:
                value1 = niftiImage[a][b][props.pointPos.z];
                value2 = drawImage[a][b][props.pointPos.z];
                break;
              default:
                break;
            }
            const alpha = 255;
            // const grayValue1 = value1 & 0xff
            // const grayValue1 = (value1 + 32768) % 256
            const grayValue1 = value1 * 255 % 256
            const grayValue2 = value2 * 255 % 256
            imageData1.data[(a + b * width) * 4 + 0] = grayValue1;
            imageData1.data[(a + b * width) * 4 + 1] = grayValue1;
            imageData1.data[(a + b * width) * 4 + 2] = grayValue1;
            imageData1.data[(a + b * width) * 4 + 3] = alpha;

            imageData2.data[(a + b * width) * 4 + 0] = grayValue2;
            imageData2.data[(a + b * width) * 4 + 1] = 0;
            imageData2.data[(a + b * width) * 4 + 2] = 0;
            imageData2.data[(a + b * width) * 4 + 3] = value2 == 1 ? alpha * 0.6 : 0;
          }
        }
        tempCtx.putImageData(imageData1, 0, 0);
        if (viewMsg.type !== 3) ctx1.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, displayHeight);
        else ctx1.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);

        tempCtx.putImageData(imageData2, 0, 0);
        if (viewMsg.type !== 3) {
          ctx2.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, displayHeight);
          // ctx2.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);
          // ctx2.scale(1, props.rate);
        }
        else ctx2.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);

        // 设置画笔大小
        ctx2.strokeStyle = "red";
        ctx2.lineWidth = props.panSize * 2;
        // ctx2.save();
        // setOldImageData(ctx2.getImageData(0, 0, width, displayHeight).data.map( item => item !== 0 ? 1 : 0));
        // ctx2.scale(1, props.rate);
      }
    }
  }, [props.niftiImage, props.pointPos, props.tool, props.pointPos])





  // 十字点击壳
  // const [mousePos, setMousePos] = useState({ a: 0, b: 0 });
  const crossRef = useRef(null);

  useEffect(() => {
    if(props.tool !== 0) return;
    const canvas = crossRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#F8AFA6';
    ctx.setLineDash([8, 4]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let a = 0; 
    let b = 0;
    switch (viewMsg.type) {
      case 1:
        a = props.pointPos.y; 
        b = props.pointPos.z;
        break;
      case 2:
        a = props.pointPos.x; 
        b = props.pointPos.z;
        break;
      case 3:
        a = props.pointPos.x; 
        b = props.pointPos.y;
        break;
      default:
        break;
    }
    drawHorizontalLine(ctx, b, canvas.width);
    drawVerticalLine(ctx, a, canvas.height);
  }, [props.pointPos, props.tool]);

  function drawHorizontalLine(ctx, b, width) {
    ctx.beginPath();
    ctx.moveTo(0, viewMsg.type == 3 ? b : b * props.rate);
    ctx.lineTo(width, viewMsg.type == 3 ? b : b * props.rate);
    ctx.stroke();
  }

  function drawVerticalLine(ctx, a, height) {
    ctx.beginPath();
    ctx.moveTo(a, 0);
    ctx.lineTo(a, height);
    ctx.stroke();
  }

  function handleLocateMouseDown(event) {
    const rect = event.target.getBoundingClientRect();
    console.log(props.pointPos);
    document.addEventListener("mousemove", handleLocateMouseMove);
    document.addEventListener("mouseup", handleLocateMouseUp);
  }

  function handleLocateMouseMove(event) {
    const rect = imgRef.current.getBoundingClientRect();
    let a = Math.round(event.clientX - rect.left);
    let b = viewMsg.type == 3 ? Math.round(event.clientY - rect.top) : Math.round((event.clientY - rect.top) / props.rate);
    a = a > viewMsg.width - 1 ? viewMsg.width - 1 : a;
    b = b > viewMsg.height - 1 ? viewMsg.height - 1 : b;
    a = a < 0 ? 0 : a;
    b = b < 0 ? 0 : b;
    switch (viewMsg.type) {
      case 1:
        props.setPointPos(prevState => ({ ...prevState, y: a, z: b }));
        break;
      case 2:
        props.setPointPos(prevState => ({ ...prevState, x: a, z: b }));
        break;
      case 3:
        props.setPointPos(prevState => ({ ...prevState, x: a, y: b }));
        break;
      default:
        break;
    }
  }

  function handleLocateMouseUp() {
    document.removeEventListener("mousemove", handleLocateMouseMove);
    document.removeEventListener("mouseup", handleLocateMouseUp);
  }






  // 鼠标绘制图像
  const drawRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [drawPoint, setDrawPoint] = useState({ a: 0, b: 0 });

  useEffect(() => {
    if (props.tool !== 1) return;
    // console.log(viewMsg);
    const {width, height, displayHeight, type} = viewMsg;
    const drawImage = props.drawImage;

    const ctx2 = drawRef.current.getContext("2d");
    ctx2.clearRect(0, 0, drawRef.current.width, drawRef.current.height);
    const imageData2 = ctx2.createImageData(width, height);

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    for (let a = 0; a < width; a++) {
      for (let b = 0; b < height; b++) {
        let value2 = null;
        switch (type) {
          case 1:
            value2 = drawImage[props.pointPos.x][a][b];
            break;
          case 2:
            value2 = drawImage[a][props.pointPos.y][b];
            break;
          case 3:
            value2 = drawImage[a][b][props.pointPos.z];
            break;
          default:
            break;
        }
        const alpha = 255;
        const grayValue2 = value2 * 255 % 256

        imageData2.data[(a + b * width) * 4 + 0] = grayValue2;
        imageData2.data[(a + b * width) * 4 + 1] = 0;
        imageData2.data[(a + b * width) * 4 + 2] = 0;
        imageData2.data[(a + b * width) * 4 + 3] = value2 == 1 ? alpha * 0.6 : 0;
      }
    }

    tempCtx.putImageData(imageData2, 0, 0);
    if (viewMsg.type !== 3) {
      ctx2.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, displayHeight);
      // ctx2.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height); 
      // ctx2.scale(1, props.rate)
    }
    else ctx2.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);

  }, [drawing, drawPoint])


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
    // console.log(a, b);
    // 绘制像素点
    switch (viewMsg.type) {
      case 1:
        props.drawImage[props.pointPos.x][a][b] = 1;
        break;
      case 2:
        props.drawImage[a][props.pointPos.y][b] = 1;
        break;
      case 3:
        props.drawImage[a][b][props.pointPos.z] = 1;
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
    // const canvas = drawRef.current;
    // const ctx = canvas.getContext('2d');
    // ctx.beginPath();
    const a = event.nativeEvent.offsetX;
    const b = viewMsg.type == 3 ? event.nativeEvent.offsetY : Math.round(event.nativeEvent.offsetY / props.rate);
    // ctx.moveTo(a, b);
    drawSolidCircle(a, b, props.panSize);
    setDrawPoint({ a, b });
    setDrawing(true);
  }

  function handleDrawMouseUp() {
    setDrawing(false);
  }

  
  function handleDrawMouseMove(event) {
    if (drawing) {
      // const canvas = drawRef.current;
      // const ctx = canvas.getContext('2d');
      const a = event.nativeEvent.offsetX;
      const b = viewMsg.type == 3 ? event.nativeEvent.offsetY : Math.round(event.nativeEvent.offsetY / props.rate);
      drawSolidCircle(a, b, props.panSize);
      setDrawPoint(prev => {
        drawParallelLine(a, b, prev.a, prev.b, props.panSize);
        return { a, b };
      });
      // ctx.lineTo(a, b);
      // ctx.stroke();
    }
  }

  return (
    <div className='border-2' style={{position: 'relative' }}>
      <canvas ref={imgRef} >
        Your browser does not support the canvas element.
      </canvas>
      <canvas
        ref={crossRef}
        width={viewMsg.width}
        height={viewMsg.displayHeight}
        onMouseDown={handleLocateMouseDown}
        style={{ ...canvasStyle, border: "1px solid black", display: props.tool == 0 ? 'block' : 'none' }}
      >
        Your browser does not support the canvas element.
      </canvas>
      <canvas
        ref={drawRef}
        width={viewMsg.width}
        height={viewMsg.displayHeight}
        onMouseDown={handleDrawMouseDown}
        onMouseUp={handleDrawMouseUp}
        onMouseMove={handleDrawMouseMove}
        style={{ ...canvasStyle, border: "1px solid black", display: props.tool == 1 ? 'block' : 'none' }}
      >
        Your browser does not support the canvas element.
      </canvas>
    </div>
  )
}

export default View