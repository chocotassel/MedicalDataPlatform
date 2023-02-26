import React, { useEffect } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const imgList = []

function MainView() {
  const containerRef = React.createRef()
  const controlsRef = React.createRef()

  // 场景和相机
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,   //角度
    500 / 500,
    0.1,  //近端
    1000  //远端
  )
  camera.position.set(0, 0, 10)
  camera.lookAt(scene.position)
  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0x333333))
  renderer.setSize(500, 500)
  renderer.shadowMap.enabled = true

  // 立方体和材质
  const materials = imgList.map(img => {
    const map = new THREE.TextureLoader().load(img)
    return new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide })
  })
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })

  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(0,0,0)
  cube.castShadow = true
  cube.scale.setX(-1)
  scene.add(cube)

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
    <div className='border-2' ref={containerRef}></div>
  )
}

export default MainView