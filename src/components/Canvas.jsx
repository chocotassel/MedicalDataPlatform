import React, { useState, useEffect, useRef } from "react";

function Canvas(props) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pointPos, setPointPos] = useState({ x: 100, y: 100 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHorizontalLine(ctx, pointPos.y, canvas.width);
    drawVerticalLine(ctx, pointPos.x, canvas.height);
  }, [pointPos]);

  function drawHorizontalLine(ctx, y, width) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  function drawVerticalLine(ctx, x, height) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  function handleMouseDown(event) {
    const rect = event.target.getBoundingClientRect();
    setMousePos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePos({ x, y });
    setPointPos({ x, y });
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      onMouseDown={handleMouseDown}
      style={{ border: "1px solid black" }}
    >
      Your browser does not support the canvas element.
    </canvas>
  );
}

export default Canvas;
