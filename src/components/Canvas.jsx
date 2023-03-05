import React, { useState, useEffect, useRef } from "react";

function Canvas(props) {
  const [mousePos, setMousePos] = useState({ a: 0, b: 0 });
  // const [pointPos, setPointPos] = useState({ x: 100, y: 100 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#F8AFA6';
    ctx.setLineDash([8, 4]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const a = 0; 
    const b = 0;
    if (props.xSize < 0) { a = props.pointPos.y; b = props.pointPos.z; }
    else if (props.ySize < 0) { a = props.pointPos.x; b = props.pointPos.z; }
    else if (props.zSize < 0) { a = props.pointPos.x; b = props.pointPos.y; }
    else return
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
      a: event.clientX - rect.left,
      b: event.clientY - rect.top,
    });
    console.log(props.pointPos);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(event) {
    const rect = event.target.getBoundingClientRect();
    const a = event.clientX - rect.left;
    const b = event.clientY - rect.top;
    setMousePos({ a, b });
    if (props.xSize < 0) { props.setPointPos(prevState => ({ ...prevState, y: a, z: b })); }
    else if (props.ySize < 0) { props.setPointPos(prevState => ({ ...prevState, x: a, z: b })); }
    else if (props.zSize < 0) { props.setPointPos(prevState => ({ ...prevState, x: a, y: b })); }
    else return 
    // props.setPointPos(prevState => ({ ...prevState, x, y }));
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <canvas
      ref={canvasRef}
      width={props.width}
      height={props.height}
      onMouseDown={handleMouseDown}
      style={{ ...props.style, border: "1px solid black" }}
    >
      Your browser does not support the canvas element.
    </canvas>
  );
}

export default Canvas;
