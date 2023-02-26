import React, { useEffect } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function MainView() {
  const containerRef = React.createRef()
  const controlsRef = React.createRef()

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
  renderer.setClearColor(new THREE.Color(0xeeeeee))
  renderer.setSize(500, 500)
  renderer.shadowMap.enabled = true

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