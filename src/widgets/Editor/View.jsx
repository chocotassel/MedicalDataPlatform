import React, { useEffect, useState, useRef } from 'react'

function View(props) {
  const container = React.createRef()

  const canvasStyle = {
    position: 'absolute',
    top: 0,
    left: 0
  }

  // 加载切片
  useEffect(() => {
    // console.log(props.niftiImage);
    if ( props.niftiImage != null ) {

      const { width, height, niftiImage } = props;
      const ctx = container.current.getContext('2d');
      container.current.width = width;
      container.current.height = height;

      const imageData2 = ctx.createImageData(width, height);
      for (let a = 0; a < width; a++) {
        for (let b = 0; b < height; b++) {
          let value = null;
          switch (props.type) {
            case 1:
              value = niftiImage[props.pointPos.x][a][b];
              break;
            case 2:
              value = niftiImage[a][props.pointPos.y][b];
              break;
            case 3:
              value = niftiImage[a][b][props.pointPos.z];
              break;
            default:
              break;
          }
          const alpha = 255;
          const grayValue = (65535 - (value - (-32768)) * (65535 - 0) / (32767 - (-32768)) ) / 256
          imageData2.data[(a + b * width) * 4 + 0] = value & 0xff;
          imageData2.data[(a + b * width) * 4 + 1] = value & 0xff;
          imageData2.data[(a + b * width) * 4 + 2] = value & 0xff;
          imageData2.data[(a + b * width) * 4 + 3] = alpha;
        }
      }
      ctx.putImageData(imageData2, 0, 0);
    }
  }, [props.niftiImage, props.pointPos])


  // 点击壳
  const [mousePos, setMousePos] = useState({ a: 0, b: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#F8AFA6';
    ctx.setLineDash([8, 4]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let a = 0; 
    let b = 0;
    switch (props.type) {
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
  }, [props.pointPos]);

  function drawHorizontalLine(ctx, b, width) {
    ctx.beginPath();
    ctx.moveTo(0, b);
    ctx.lineTo(width, b);
    ctx.stroke();
  }

  function drawVerticalLine(ctx, a, height) {
    ctx.beginPath();
    ctx.moveTo(a, 0);
    ctx.lineTo(a, height);
    ctx.stroke();
  }

  function handleMouseDown(event) {
    const rect = event.target.getBoundingClientRect();
    setMousePos({
      a: Math.round(event.clientX - rect.left),
      b: Math.round(event.clientY - rect.top),
    });
    console.log(props.pointPos);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(event) {
    const rect = event.target.getBoundingClientRect();
    const a = Math.round(event.clientX - rect.left);
    const b = Math.round(event.clientY - rect.top);
    setMousePos({ a, b });
    switch (props.type) {
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

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <div className='border-2' style={{position: 'relative' }}>
      <canvas ref={container} ></canvas>
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        onMouseDown={handleMouseDown}
        style={{ ...canvasStyle, border: "1px solid black" }}
      >
        Your browser does not support the canvas element.
      </canvas>
    </div>
  )
}

export default View