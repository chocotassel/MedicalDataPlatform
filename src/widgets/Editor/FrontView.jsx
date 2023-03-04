import React, { useEffect } from 'react'

function FrontView(props) {
  const container = React.createRef()

  // 加载切片
  useEffect(() => {
    // console.log(props.niftiImage);
    if ( props.niftiImage != null ) {

      const { xSize, y, zSize, niftiImage } = props;
      const ctx = container.current.getContext('2d');
      container.current.width = xSize;
      container.current.height = zSize;

      const imageData2 = ctx.createImageData(xSize, zSize);
      for (let x = 0; x < xSize; x++) {
        for (let z = 0; z < zSize; z++) {
          const value = niftiImage[x][y][z];
          const alpha = 255;
          imageData2.data[(x + z * xSize) * 4 + 0] = value >> 8;
          imageData2.data[(x + z * xSize) * 4 + 1] = value & 0xff;
          imageData2.data[(x + z * xSize) * 4 + 2] = 0;
          imageData2.data[(x + z * xSize) * 4 + 3] = alpha;
        }
      }
      ctx.putImageData(imageData2, 0, 0);
    }
  }, [props.niftiImage, props.y])


  return (
    <div className='border-2'>
      <canvas ref={container}></canvas>
    </div>
  )
}

export default FrontView