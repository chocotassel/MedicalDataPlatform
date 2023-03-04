import React, { useEffect } from 'react'

function TopView(props) {
  const container = React.createRef()

  // 加载切片
  useEffect(() => {
    // console.log(props.niftiImage);
    if ( props.niftiImage != null ) {

      const { xSize, ySize, z, niftiImage } = props;
      const ctx = container.current.getContext('2d');
      container.current.width = xSize;
      container.current.height = ySize;

      const imageData2 = ctx.createImageData(xSize, ySize);
      for (let x = 0; x < xSize; x++) {
        for (let y = 0; y < ySize; y++) {
          const value = niftiImage[x][y][z];
          const alpha = 255;
          imageData2.data[(x + y * xSize) * 4 + 0] = value >> 8;
          imageData2.data[(x + y * xSize) * 4 + 1] = value & 0xff;
          imageData2.data[(x + y * xSize) * 4 + 2] = 0;
          imageData2.data[(x + y * xSize) * 4 + 3] = alpha;
        }
      }
      ctx.putImageData(imageData2, 0, 0);
    }
  }, [props.niftiImage, props.z])


  return (
    <div className='border-2'>
      <canvas ref={container} ></canvas>
    </div>
  )
}

export default TopView