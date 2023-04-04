// 圆形路径算法
export const drawCircle = function(x0, y0, radius) {
  let x = 0;
  let y = radius;
  let d = 1 - radius;

  while (y >= x) {
    plotPoints(x, y, x0, y0);
    if (d < 0) {
      x++;
      d += 2 * x + 1;
    } else {
      x++;
      y--;
      d += 2 * (x - y) + 1;
    }
    plotPoints(x, y, x0, y0);
  }
}

function plotPoints(x, y, x0, y0) {
  drawPixel(x + x0, y + y0);
  drawPixel(-x + x0, y + y0);
  drawPixel(x + x0, -y + y0);
  drawPixel(-x + x0, -y + y0);
  drawPixel(y + x0, x + y0);
  drawPixel(-y + x0, x + y0);
  drawPixel(y + x0, -x + y0);
  drawPixel(-y + x0, -x + y0);
}

function drawPixel(a, b) {
  console.log(a, b);
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





// 扫描线填充算法
export const drawSolidCircle = function(x0, y0, radius) {
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