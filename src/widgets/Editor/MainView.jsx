import React, { useEffect } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


const imgList = []

function MainView() {
  const [z, setZ] = React.useState(0)

  const containerRef = React.createRef()
  const controlsRef = React.createRef()

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

    if (containerRef.current) {
      controlsRef.current = new OrbitControls(camera, containerRef.current)
      controlsRef.current.enableDamping = true
      controlsRef.current.enableZoom = true
      controlsRef.current.enablePan = true
    }
    containerRef.current.appendChild(renderer.domElement)

  }, [])


  return (
    <>
      <div className='border-2' ref={containerRef}></div>
      {/* <button onClick={() => setZ( z => z + 1 )}>+1</button>
      <button onClick={() => setZ( z => z - 1 )}>-1</button> */}
    </>
  )
}

export default MainView