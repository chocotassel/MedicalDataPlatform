import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { useDispatch, useSelector } from 'react-redux';
import { setX, setY, setZ } from '../../store/modules/pointPosState';



function MainView(props) {
  // redux
  const pointPos = useSelector((state) => state.pointPos);
  const modelSize = useSelector((state) => state.modelSize);
  const tool = useSelector((state) => state.tool);
  const dispatch = useDispatch();

  // 引用
  const pointRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const zAxisRef = useRef(null);
  const container = useRef(null);
  const requestRef = useRef(null);
  const cameraRef = useRef(null);


  // 点坐标
  const { xSize, ySize, zSize, rate } = modelSize
  const { x, y, z } = pointPos

  const width = xSize / 2
  const height = ySize / 2


  useEffect(() => {
    // 初始化
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      10000
    );
    camera.position.set(xSize, ySize, zSize);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.current.appendChild(renderer.domElement);


    // 点
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
    scene.add(pointMesh);
    pointRef.current = pointMesh;

    // 平行线
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, y, z),
      new THREE.Vector3(xSize, y, z),
    ]);
    const xAxis = new THREE.Line(xAxisGeometry, lineMaterial);
    scene.add(xAxis);
    xAxisRef.current = xAxis;

    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0, z),
      new THREE.Vector3(x, ySize, z),
    ]);
    const yAxis = new THREE.Line(yAxisGeometry, lineMaterial);
    scene.add(yAxis);
    yAxisRef.current = yAxis;

    const zAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x, y, zSize * rate),
    ]);
    const zAxis = new THREE.Line(zAxisGeometry, lineMaterial);
    scene.add(zAxis);
    zAxisRef.current = zAxis;


    // 坐标轴和控制器
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // 模型加载
    const objLoad = new OBJLoader()
    // objLoad.load('/public/objs/nii2mesh_0b2be9e0-886b-4144-99f0-8bb4c6eaa848.obj', function(obj) {
    objLoad.load('/public/objs/nii2mesh_0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.obj', function(obj) {
      // obj.scale.set(0.4, 0.4, -0.4)
      obj.position.set(384, 384, 54)
      scene.add(obj)
    })

    // 创建地板
    // var floorGeometry = new THREE.PlaneGeometry(1000, 1000); // 宽度和高度为10
    // var floorMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00}); // 颜色为白色
    // var floor = new THREE.Mesh(floorGeometry, floorMaterial); // 创建网格对象
    // floor.rotation.x = -Math.PI / 2; // 将地板旋转90度，使其水平放置
    // scene.add(floor); // 将地板添加到场景中

    // 创建灯光
    var light = new THREE.DirectionalLight(0xffffff, 1); // 颜色为白色，强度为1
    light.position.set(0, 5, 0); // 设置灯光的位置在上方
    scene.add(light); // 将灯光添加到场景中

    // 动画
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      pointMesh.position.set(new THREE.Vector3(x, y, z));
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      container.current.removeChild(renderer.domElement);
    };
  }, [xSize, ySize, zSize, rate]);



  useEffect(() => {
    pointRef.current.geometry.attributes.position.setXYZ(0, x, y, z);
    pointRef.current.geometry.attributes.position.needsUpdate = true;
    xAxisRef.current.geometry.setFromPoints([
      new THREE.Vector3(0, y, z),
      new THREE.Vector3(xSize, y, z),
    ]);
    yAxisRef.current.geometry.setFromPoints([
      new THREE.Vector3(x, 0, z),
      new THREE.Vector3(x, ySize, z),
    ]);
    zAxisRef.current.geometry.setFromPoints([
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x, y, zSize),
    ]);
    cameraRef.current.lookAt(x, y, z);
  }, [x, y, z])



  return (
    <div ref={container} style={props.viewStyle}></div>
  )
}

export default MainView