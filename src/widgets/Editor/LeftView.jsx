import React, { useEffect } from 'react'

function LeftView(props) {
  const container = React.createRef()

  // 加载切片
  useEffect(() => {
    // console.log(props.niftiImage);
    if ( props.niftiImage != null ) {

      const { x, ySize, zSize, niftiImage } = props;
      const ctx = container.current.getContext('2d');
      container.current.width = ySize;
      container.current.height = zSize;

      const imageData2 = ctx.createImageData(ySize, zSize);
      for (let y = 0; y < ySize; y++) {
        for (let z = 0; z < zSize; z++) {
          const value = niftiImage[x][y][z];
          const alpha = 255;
          imageData2.data[(y + z * ySize) * 4 + 0] = value >> 8;
          imageData2.data[(y + z * ySize) * 4 + 1] = value & 0xff;
          imageData2.data[(y + z * ySize) * 4 + 2] = 0;
          imageData2.data[(y + z * ySize) * 4 + 3] = alpha;
        }
      }
      ctx.putImageData(imageData2, 0, 0);
    }
  }, [props.niftiImage, props.x])


  return (
    <div className='border-2'>
      <canvas ref={container}></canvas>
    </div>
  )
}

export default LeftView