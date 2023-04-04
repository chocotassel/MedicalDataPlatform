
"use strict";

/*** Imports ***/

/**
 * nifti
 * @type {*|{}}
 */
var n2a = n2a || {};
import * as nifti from 'nifti-reader-js';


/*** Static Methods ***/

/**
 * get original array from NIfTI file
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Array}
 */
n2a.getOriginalArray = function (arrayBuffer) {

  // read NIfTI file header
  const header = nifti.readHeader(arrayBuffer);
  console.log(header);

  // read NIfTI file image data
  const imageData = nifti.readImage(header, arrayBuffer);
  console.log(imageData);

  // get dimension number
  //   0: unknown data type
  //   1: binary data (each pixel has only two values)
  //   2: unsigned character data (each pixel is stored in 1 byte)
  //   4: 16-bit signed integer data (each pixel is stored in 2 bytes)
  //   8: 32-bit signed integer data (each pixel is stored in 4 bytes)
  //   16: 32-bit floating point data (each pixel is stored in 4 bytes)
  //   32: 64-bit double precision floating point data (each pixel is stored in 8 bytes)
  //   64: 128-bit complex data (each pixel is stored in 16 bytes, including real and imaginary parts)
  //   256: 8-bit signed integer data (each pixel is stored in 1 byte)
  //   512: 16-bit unsigned integer data (each pixel is stored in 2 bytes)
  //   768: 32-bit unsigned integer data (each pixel is stored in 4 bytes)


  // transform image data to typed array
  switch (header.datatypeCode) {
    case 2:
      var imageTypedArray = new Uint8Array(imageData);
      break;
    case 4:
      var imageTypedArray = new Int16Array(imageData);
      break;
    case 8:
      var imageTypedArray = new Int32Array(imageData);
      break;
    case 16:
      var imageTypedArray = new Float32Array(imageData);
      break;
    case 32:
      var imageTypedArray = new Float64Array(imageData);
      break;
    case 256:
      var imageTypedArray = new Int8Array(imageData);
      break;
    case 512:
      var imageTypedArray = new Uint16Array(imageData);
      break;
    case 768:
      var imageTypedArray = new Uint32Array(imageData);
      break;
    default:
      var imageTypedArray = new Uint8Array(imageData);
      break;
  }


  // get dimension array
  const dimNum = header.dims[0];
  const dims = [];
  for (let i = 1; i <= dimNum; i++) {
    dims.push(header.dims[i]);
  }

  // transform typed array to multi array
  const niftiImage = typedArrayToMultiArray(imageTypedArray, dims);

  return niftiImage;
}

/**
 * transform typed array to multi array (row-major order)
 * @param {Array} imageTypedArray 
 * @param {Array} dims 
 * @returns {Array}
 */
function typedArrayToMultiArray(imageTypedArray, dims) {
  const TypedArray = imageTypedArray.constructor;
  return (function recursive(coords) {
    if (coords.length === dims.length - 1) {
      const result = new TypedArray(dims[coords.length]);
      for (let i = 0; i < dims[coords.length]; i++) {
        const index = get1DIndex([...coords, i], dims);
        result[i] = imageTypedArray[index];
      }
      return result;
    } else {
      const result = new Array(dims[coords.length]);
      for (let i = 0; i < dims[coords.length]; i++) {
        result[i] = recursive([...coords, i]);
      }
      return result;
    }
  })([]);
}

/**
 * get 1D index from multi array
 * @param {Array} coords 
 * @param {Array} dims 
 * @returns {Number}
 */
function get1DIndex(coords, dims) {
  let index = 0;
  let stride = 1;

  for (let i = 0; i < coords.length; i++) {
    index += coords[i] * stride;
    stride *= dims[i];
  }

  return index;
}


/**
 * get original array 3D from NIfTI file
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Array}
 */
n2a.getOriginalArray3D = function (arrayBuffer) {

  // read NIfTI file header
  const header = nifti.readHeader(arrayBuffer);
  console.log(header);
  if (header.dims[0] !== 3) {
    console.error('The number of dimensions is not 3.');
    return;
  }

  // read NIfTI file image data
  const imageData = nifti.readImage(header, arrayBuffer);

  // 将ArrayBuffer类型的图像数据转换为Uint8Array类型的图像数据
  const imageTypedArray = new Uint8Array(imageData);

  const xSize = header.dims[1];
  const ySize = header.dims[2];
  const zSize = header.dims[3];
  
  const niftiImage = new Array(xSize);
  const drawImage = new Array(xSize);
  for (let x = 0; x < xSize; x++) {
    niftiImage[x] = new Array(ySize);
    drawImage[x] = new Array(ySize);
    for (let y = 0; y < ySize; y++) {
      niftiImage[x][y] = new Array(zSize);
      drawImage[x][y] = new Array(zSize);
      for (let z = 0; z < zSize; z++) {
        const index = x + y * xSize + z * xSize * ySize;
        niftiImage[x][y][z] = imageTypedArray[index];
        drawImage[x][y][z] = 0;
      }
    }
  }

  return {
    niftiImage,
    drawImage
  }
}









/**
 * transform NIfTI file to NRRD file
 * @param {Array} dataArray
 * @param {Array} dims
 * @param {Array} affine
 * @param {Array} pixDims
 * @returns {Array}
 */
n2a.affineTransform = function (arrayBuffer) {
  // Read the NIfTI header
  const header = nifti.readHeader(arrayBuffer);
  const dims = header.dims;
  const affine = header.affine;
  const pixDims = header.pixDims;

  // 检查输入数组的维度是否正确
  if (dims[0] !== 3) return

  // 计算缩放因子
  const scaleFactor = 1 / pixDims[1];

  // 计算新的数组尺寸
  const newDims = [
    dims[0],
    Math.round(dims[1] * pixDims[1] * scaleFactor),
    Math.round(dims[2] * pixDims[2] * scaleFactor),
    Math.round(dims[3] * pixDims[3] * scaleFactor),
  ];

  // 创建一个新的多维数组用于存储转换后的数据
  const transformedArray = new Array(newDims[1])
    .fill(0)
    .map(() => new Array(newDims[2])
      .fill(0)
      .map(() => new Array(newDims[3]).fill(0)));

  // Convert the arrayBuffer to a Uint8Array
  const dataArray = new Uint8Array(arrayBuffer, header.vox_offset);

  // 对原始数组中的每个点应用仿射变换
  for (let x = 0; x < dims[1]; x++) {
    for (let y = 0; y < dims[2]; y++) {
      for (let z = 0; z < dims[3]; z++) {
        const index = x + y * dims[1] + z * dims[1] * dims[2]; 

        if(dataArray[index] === 0) continue

        // 根据缩放因子将新坐标映射到新数组中
        const newX = x * pixDims[1];
        const newY = y * pixDims[2];
        const newZ = z * pixDims[3];

        // 根据缩放因子将新坐标映射到新数组中
        const iNewX = Math.round(newX * scaleFactor);
        const iNewY = Math.round(newY * scaleFactor);
        const iNewZ = Math.round(newZ * scaleFactor);

        // 对于边界上的像素，直接赋值，否则进行线性插值
        if (
          iNewX >= 0 &&
          iNewX < newDims[1] &&
          iNewY >= 0 &&
          iNewY < newDims[2] &&
          iNewZ >= 0 &&
          iNewZ < newDims[3]
        ) {
          // if (
          //   iNewX === Math.floor(newX * scaleFactor) &&
          //   iNewY === Math.floor(newY * scaleFactor) &&
          //   iNewZ === Math.floor(newZ * scaleFactor)
          // ) {
          //   transformedArray[iNewX][iNewY][iNewZ] = dataArray[index];
          // } else {
            // const x1 = Math.floor(newX * scaleFactor);
            // const x2 = x1 + 1;
            // const y1 = Math.floor(newY * scaleFactor);
            // const y2 = y1 + 1;
            // const z1 = Math.floor(newZ * scaleFactor);
            // const z2 = z1 + 1;
            // const dx = newX * scaleFactor - x1;
            // const dy = newY * scaleFactor - y1;
            // const dz = newZ * scaleFactor - z1;

            // const c000 = dataArray[x1][y1][z1];
            // const c001 = dataArray[x1][y1][z2];
            // const c010 = dataArray[x1][y2][z1];
            // const c011 = dataArray[x1][y2][z2];
            // const c100 = dataArray[x2][y1][z1];
            // const c101 = dataArray[x2][y1][z2];
            // const c110 = dataArray[x2][y2][z1];
            // const c111 = dataArray[x2][y2][z2];
            // const w000 = (1 - dx) * (1 - dy) * (1 - dz);
            // const w001 = (1 - dx) * (1 - dy) * dz;
            // const w010 = (1 - dx) * dy * (1 - dz);
            // const w011 = (1 - dx) * dy * dz;
            // const w100 = dx * (1 - dy) * (1 - dz);
            // const w101 = dx * (1 - dy) * dz;
            // const w110 = dx * dy * (1 - dz);
            // const w111 = dx * dy * dz;
    
            // const value =
            //   c000 * w000 +
            //   c001 * w001 +
            //   c010 * w010 +
            //   c011 * w011 +
            //   c100 * w100 +
            //   c101 * w101 +
            //   c110 * w110 +
            //   c111 * w111;


          // if (iNewX === 0 || iNewX === newDims[1] - 1 || iNewY === 0 || iNewY === newDims[2] - 1 || iNewZ === 0 || iNewZ === newDims[3] - 1) {
          //   transformedArray[iNewX][iNewY][iNewZ] = dataArray[index];
          // } else {
          //   if 
          //   transformedArray[iNewX][iNewY][iNewZ] = value;
          // }


          for (let i = 0; i < pixDims[2] * scaleFactor; i++) {
            for (let j = 0; j < pixDims[3] * scaleFactor; j++) {
              if (iNewX + i < 0 || iNewX + i >= newDims[1] || iNewY + j < 0 || iNewY + j >= newDims[2] || iNewZ < 0 || iNewZ >= newDims[3]) continue
              transformedArray[iNewX][iNewY + i][iNewZ + j] = dataArray[index];
            }
          }


          // transformedArray[iNewX][iNewY][iNewZ] = dataArray[index]
        }
      }
    }
  }

  return transformedArray;
}




/**
 * webGPU version of affineTransform
 */
async function createWebGPUDevice() {
  if (!navigator.gpu) {
    console.error('WebGPU is not supported.');
    return null;
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  return device;
}

n2a.affineTransformWebGPU = async function (dataArray, dims, affine, pixDims) {
  // 获取 WebGPU 设备
  const device = await createWebGPUDevice();

  // 检查输入数组的维度是否正确
  if (dims[0] !== 3) return;

  // 计算缩放因子
  const scaleFactor = 1 / pixDims[1];

  // 计算新的数组尺寸
  const newDims = [
    dims[0],
    Math.round(dims[1] * pixDims[1] * scaleFactor),
    Math.round(dims[2] * pixDims[2] * scaleFactor),
    Math.round(dims[3] * pixDims[3] * scaleFactor),
  ];

  // 计算着色器代码
  const shaderCode = `
    [[block]] struct DataArray {
      dataArray: array<array<array<u32, ${dims[3]}>, ${dims[2]}>, ${dims[1]}>;
    };
  
    [[block]] struct TransformedArray {
      transformedArray: array<array<array<u32, ${newDims[3]}>, ${newDims[2]}>, ${newDims[1]}>;
    };

    // ...

  `;

  // 创建计算管道
  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'read-only', minBindingSize: 4 },
          },
          {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'read-write', minBindingSize: 4 },
          },
        ],
      })],
    }),
    compute: {
      module: device.createShaderModule({
        code: shaderCode,
      }),
      entryPoint: 'main',
    },
  });

  // 创建缓冲区
  const dataArrayBuffer = device.createBuffer({
    size: dataArray.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  new Uint8Array(dataArrayBuffer.getMappedRange()).set(dataArray);
  dataArrayBuffer.unmap();

  const transformedArrayBuffer = device.createBuffer({
    size: transformedArray.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  // 创建绑定组
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: dataArrayBuffer } },
      { binding: 1, resource: { buffer: transformedArrayBuffer } },
    ],
  });
    
    // 创建命令编码器
    const commandEncoder = device.createCommandEncoder();
    
    // 设置计算管道和绑定组
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    
    // 调度计算任务
    passEncoder.dispatch(newDims[1], newDims[2], newDims[3]);
    passEncoder.endPass();
    
    // 将结果从 GPU 复制到 CPU
    commandEncoder.copyBufferToBuffer(
    transformedArrayBuffer,
    0,
    dataArrayBuffer,
    0,
    transformedArray.byteLength
    );
    
    // 提交命令
    device.queue.submit([commandEncoder.finish()]);
    
    // 从缓冲区读取结果
    await transformedArrayBuffer.mapAsync(GPUMapMode.READ);
    const transformedArrayData = new Float32Array(transformedArrayBuffer.getMappedRange());
    
    // 将线性数组转换回三维数组
    const transformedArray = [];
    for (let x = 0; x < newDims[1]; x++) {
    transformedArray[x] = [];
    for (let y = 0; y < newDims[2]; y++) {
    transformedArray[x][y] = [];
    for (let z = 0; z < newDims[3]; z++) {
    const index = x * newDims[2] * newDims[3] + y * newDims[3] + z;
    transformedArray[x][y][z] = transformedArrayData[index];
    }
    }
    }
    
    // 释放映射的内存
    transformedArrayBuffer.unmap();
    
    return transformedArray;
}




/**
 * WebGL version of affineTransform
 */
function createWebGL2Context() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error("WebGL 2 is not supported.");
    return null;
  }
  return gl;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("An error occurred compiling the shader: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

n2a.affineTransformWebGL = function (arrayBuffer) {
  // Read the NIfTI header
  const header = nifti.readHeader(arrayBuffer);
  const dims = header.dims;
  const affine = header.affine;
  const pixDims = header.pixDims;

  // 检查输入数组的维度是否正确
  if (dims[0] !== 3) return;

  // 计算缩放因子
  const scaleFactor = 1 / pixDims[1];

  // 计算新的数组尺寸
  const newDims = [
    dims[0],
    Math.round(dims[1] * pixDims[1] * scaleFactor),
    Math.round(dims[2] * pixDims[2] * scaleFactor),
    Math.round(dims[3] * pixDims[3] * scaleFactor),
  ];

  // Convert the arrayBuffer to a Uint8Array
  const dataArray = new Uint8Array(arrayBuffer, header.vox_offset);

  // 创建 WebGL 2 上下文
  const gl = createWebGL2Context();
  if (!gl) {
    console.error("WebGL 2 is not supported.");
    return null;
  }

  // 创建顶点着色器和片段着色器
  const vertexShaderSource = `#version 300 es
    in vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `;
  const fragmentShaderSource = `#version 300 es
    precision mediump float;
    precision mediump sampler3D;
    uniform sampler3D u_dataArray;
    uniform vec3 u_scaleFactor;
    uniform vec3 u_newDims;
    out vec4 fragColor;

    void main() {
      vec3 texCoords = gl_FragCoord.xyz * u_scaleFactor;
      if (texCoords.x < u_newDims.x && texCoords.y < u_newDims.y && texCoords.z < u_newDims.z) {
        float value = texture(u_dataArray, vec3(texCoords.y, texCoords.x, texCoords.z)).r;
        fragColor = vec4(value, value, value, 1.0);
      } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    }
  `;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // 创建着色器程序
  const program = createProgram(gl, vertexShader, fragmentShader);

  // 创建顶点缓冲区
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 创建顶点数组对象 (VAO)
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // 创建 3D 纹理
  const dataArrayTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_3D, dataArrayTexture);
  gl.texImage3D(
  gl.TEXTURE_3D,
  0,
  gl.R8,
  dims[1],
  dims[2],
  dims[3],
  0,
  gl.RED,
  gl.UNSIGNED_BYTE,
  dataArray
  );

  // 设置纹理参数
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

  // 创建帧缓冲区对象 (FBO)
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  const outputTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_3D, outputTexture);
  gl.texImage3D(
  gl.TEXTURE_3D,
  0,
  gl.R8,
  newDims[1],
  newDims[2],
  newDims[3],
  0,
  gl.RED,
  gl.UNSIGNED_BYTE,
  null
  );

  // 设置输出纹理参数
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

  gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, outputTexture, 0, 0);
  gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
  
  // 设置 WebGL 视口和清除颜色
  gl.viewport(0, 0, newDims[1], newDims[2] * newDims[3]);
  gl.clearColor(0, 0, 0, 0);
  
  // 使用着色器程序和绑定纹理
  gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_3D, dataArrayTexture);

  const dataArrayUniformLocation = gl.getUniformLocation(program, "u_dataArray");
  gl.uniform1i(dataArrayUniformLocation, 0);
  
  const scaleFactorUniformLocation = gl.getUniformLocation(program, "u_scaleFactor");
  gl.uniform3f(scaleFactorUniformLocation, scaleFactor, scaleFactor, scaleFactor);
  
  const newDimsUniformLocation = gl.getUniformLocation(program, "u_newDims");
  gl.uniform3f(newDimsUniformLocation, newDims[1], newDims[2], newDims[3]);
  
  
  // 绘制
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


  // Read the result
  const resultArray = new Uint8Array(newDims[1] * newDims[2] * newDims[3]);
  gl.readPixels(0, 0, newDims[1], newDims[2], gl.RED, gl.UNSIGNED_BYTE, resultArray);

  // Clean up resources
  gl.deleteBuffer(vertexBuffer);
  gl.deleteVertexArray(vao);
  gl.deleteTexture(dataArrayTexture);
  gl.deleteTexture(outputTexture);
  gl.deleteFramebuffer(fbo);
  gl.deleteProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  // Convert the 1D resultArray to a 3D array
  const result3DArray = [];
  for (let x = 0; x < newDims[1]; x++) {
    result3DArray[x] = [];
    for (let y = 0; y < newDims[2]; y++) {
      result3DArray[x][y] = [];
      for (let z = 0; z < newDims[3]; z++) {
        result3DArray[x][y][z] = resultArray[z * newDims[1] * newDims[2] + y * newDims[1] + x];
        if(result3DArray[x][y][z] > 0) {
          console.log("非0",result3DArray[x][y][z]);
        }
      }
    }
  }

  return result3DArray;
}





/**
 * transform NIfTI file to NRRD file
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Array}
 */
n2a.getTransformedArray = function (arrayBuffer) {
  // const { dims, affine, pixDims } = nifti.readHeader(arrayBuffer);
  // const niftiImage = n2a.getOriginalArray(arrayBuffer);
  // console.log(niftiImage, dims, affine, pixDims);
  const transformedArray = n2a.affineTransform(arrayBuffer);
  // const transformedArray = n2a.affineTransformWebGPU(niftiImage, dims, affine, pixDims);
  // const transformedArray = n2a.affineTransformWebGL(arrayBuffer);
  console.log(transformedArray);
  return transformedArray;
}





/*** Internal Methods ***/



/**
 * transform typed array to multi array (Column-major order)
 * @param {Array} imageTypedArray
 * @param {Array} dims
 * @returns {Array}
 */
// function typedArrayToMultiArray(imageTypedArray, dims) {
//   if (dims.length === 1) {
//     return imageTypedArray;
//   } else {
//     const result = new Array(dims[0]);
//     const sliceSize = imageTypedArray.length / dims[0];
//     for (let i = 0; i < dims[0]; i++) {
//       const slice = imageTypedArray.subarray(i * sliceSize, (i + 1) * sliceSize);
//       result[i] = typedArrayToMultiArray(slice, dims.slice(1));
//     }
//     return result;
//   }
// }




/*** Exports ***/

// var moduleType = typeof module;
// if ((moduleType !== 'undefined') && module.exports) {
//   module.exports = n2a;
// }

export default n2a;