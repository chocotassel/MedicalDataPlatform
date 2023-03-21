import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setX, setY, setZ } from '../store/modules/pointPosState';

function CrossCanvas(props) {
  // props
  const viewMsg = props.viewMsg;

  // redux
  const pointPos = useSelector((state) => state.pointPos);
  const tool = useSelector((state) => state.tool);
  const { rate } = useSelector((state) => state.modelSize);
  const dispatch = useDispatch();

  const crossRef = useRef(null);

  useEffect(() => {
    if(tool.type !== 0) return;
    const canvas = crossRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#F8AFA6';
    ctx.setLineDash([8, 4]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let a = 0; 
    let b = 0;
    switch (viewMsg.type) {
      case 1:
        a = pointPos.y; 
        b = pointPos.z;
        break;
      case 2:
        a = pointPos.x; 
        b = pointPos.z;
        break;
      case 3:
        a = pointPos.x; 
        b = pointPos.y;
        break;
      default:
        break;
    }
    drawHorizontalLine(ctx, b, canvas.width);
    drawVerticalLine(ctx, a, canvas.height);
  }, [pointPos.x, pointPos.y, pointPos.z, tool.type]);

  function drawHorizontalLine(ctx, b, width) {
    ctx.beginPath();
    ctx.moveTo(0, viewMsg.type == 3 ? b : b * rate);
    ctx.lineTo(width, viewMsg.type == 3 ? b : b * rate);
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
    document.addEventListener("mousemove", handleLocateMouseMove);
    document.addEventListener("mouseup", handleLocateMouseUp);
  }

  function handleLocateMouseMove(event) {
    const rect = crossRef.current.getBoundingClientRect();
    let a = Math.round(event.clientX - rect.left);
    let b = viewMsg.type == 3 ? Math.round(event.clientY - rect.top) : Math.round((event.clientY - rect.top) / rate);
    a = a > viewMsg.width - 1 ? viewMsg.width - 1 : a;
    b = b > viewMsg.height - 1 ? viewMsg.height - 1 : b;
    a = a < 0 ? 0 : a;
    b = b < 0 ? 0 : b;
    switch (viewMsg.type) {
      case 1:
        dispatch(setY(a));
        dispatch(setZ(b));
        break;
      case 2:
        dispatch(setX(a));
        dispatch(setZ(b));
        break;
      case 3:
        dispatch(setX(a));
        dispatch(setY(b));
        break;
      default:
        break;
    }
  }

  function handleLocateMouseUp() {
    document.removeEventListener("mousemove", handleLocateMouseMove);
    document.removeEventListener("mouseup", handleLocateMouseUp);
  }

  
  // 滚轮事件
  useEffect(() => {
    const canvas = crossRef.current;
    
    canvas.addEventListener("wheel", props.handleScroll, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", props.handleScroll, { passive: false });
    };
  }, [viewMsg, pointPos.x, pointPos.y, pointPos.z, tool.type]);


  return (
    <canvas
      ref={crossRef}
      width={viewMsg.width}
      height={viewMsg.displayHeight}
      onMouseDown={handleLocateMouseDown}
      style={{ ...props.canvasStyle, border: "1px solid black", display: tool.type == 0 ? 'block' : 'none' }}
    >
      Your browser does not support the canvas element.
    </canvas>
  );
}

export default CrossCanvas;
