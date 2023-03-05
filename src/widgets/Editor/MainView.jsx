import React, { useEffect } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


const imgList = []

function MainView() {
  const [z, setZ] = React.useState(0)

  const container = React.createRef()
  const controls= React.createRef()

  // 场景和相机
  const scene = new THREE.Scene()
  const width = 500
  const height = 500
  // const camera = new THREE.PerspectiveCamera(
  //   75,   //角度
  //   width / height,
  //   0.1,  //近端
  //   1000  //远端
  // )
  const camera = new THREE.OrthographicCamera( width / - 20, width / 20, height / 20, height / - 20, 1, 100);
  camera.position.set(0, 0, 1)
  camera.lookAt(scene.position)
  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff))
  renderer.setSize(500, 500)
  renderer.shadowMap.enabled = true

  // 坐标轴
  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );

  // 立方体和材质
  // const materials = imgList.map(img => {
  //   const map = new THREE.TextureLoader().load(img)
  //   return new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide })
  // })
  // const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })

  // const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
  // const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  // cube.position.set(0,0,0)
  // cube.castShadow = true
  // cube.scale.setX(-1)
  // scene.add(cube)

  // 模型加载
  const otherObjLoad = new OBJLoader()
  // otherObjLoad.load('/public/objs/nii2mesh_0b2be9e0-886b-4144-99f0-8bb4c6eaa848.obj', function(obj) {
  otherObjLoad.load('/public/objs/yaoyao.obj', function(obj) {
    obj.scale.set(0.4, 0.4, -0.4)
    obj.position.set(0,-8,0)
    scene.add(obj)
  })

  // 渲染
  useEffect(() => {
    function renderScene() {
      requestAnimationFrame(renderScene)
      renderer.render(scene, camera)
    }
    renderScene()

    if (container.current) {
      controls.current = new OrbitControls(camera, container.current)
      controls.current.enableDamping = true
      controls.current.enableZoom = true
      controls.current.enablePan = true
    }
    container.current.appendChild(renderer.domElement)

      //   // 读取NIfTI文件头信息
      //   const header = nifti.readHeader(arrayBuffer);

      //   // 读取nifti文件的图像数据
      //   const imageData = nifti.readImage(header, arrayBuffer);

      //   // 将ArrayBuffer类型的图像数据转换为Int16Array类型的图像数据
      //   const imageTypedArray = new Int8Array(imageData);

      //   // 创建three.js场景、相机和渲染器
      //   const scene = new THREE.Scene();
      //   const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);
      //   camera.position.z = 10;
      //   const renderer = new THREE.WebGLRenderer();
      //   renderer.setSize(500, 500);
      //   container.current.appendChild(renderer.domElement);

      //   // 创建材质和纹理
      //   const material = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(generateTexture(imageTypedArray, header)) });

      //   // 将三维数据转换为网格对象
      //   const geometry = new THREE.BoxGeometry(1, 1, 1, header.dims[1], header.dims[2], header.dims[3]);
      //   const mesh = new THREE.Mesh(geometry, material);
      //   scene.add(mesh);

      //   // 渲染场景
      //   function animate() {
      //     requestAnimationFrame(animate);
      //     mesh.rotation.x += 0.01;
      //     mesh.rotation.y += 0.01;
      //     renderer.render(scene, camera);
      //   }
      //   animate();

      //   // 根据三维数据生成纹理
      //   function generateTexture(imageData, header) {
      //     const canvas = document.createElement('canvas');
      //     canvas.width = header.dims[1];
      //     canvas.height = header.dims[2];
      //     const context = canvas.getContext('2d');
      //     const image = context.createImageData(header.dims[1], header.dims[2]);
      //     for (let i = 0; i < imageData.length; i++) {
      //       const value = imageData[i];
      //       const alpha = 255;
      //       image.data[i * 4 + 0] = value >> 8;
      //       image.data[i * 4 + 1] = value & 0xff;
      //       image.data[i * 4 + 2] = 0;
      //       image.data[i * 4 + 3] = alpha;
      //     }
      //     context.putImageData(image, 0, 0);
      //     const texture = new THREE.Texture(canvas);
      //     texture.needsUpdate = true;
      //     texture.minFilter = THREE.LinearFilter;
      //     texture.magFilter = THREE.LinearFilter;

      //     return texture;
      //   }
  }, [])


  return (
    <>
      <div className='border-2' ref={container}></div>
    </>
  )
}

export default MainView