import * as THREE from 'three';
//轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//动画库
import gsap from 'gsap';
//dat.gui
import * as dat from 'dat.gui'


console.log(THREE);

//1. 创建场景
const scene = new THREE.Scene()

//2. 创建相机
const camera = new THREE.PerspectiveCamera(
  75,   //角度
  500 / 500,
  0.1,  //近端
  1000  //远端
)
camera.position.set(0, 0, 10)
// camera.lookAt(scene.position)
scene.add(camera)


//添加物体
//  创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
//  根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
//  将几何体添加到场景中
scene.add(cube)

//  修改物体位置 缩放 旋转
// cube.position.set(0, 0, 2)
// cube.scale.x = 2
// cube.rotation.set(Math.PI/4, 0, 0, "XYZ")

// const gui = new dat.GUI()
// gui
//   .add(cube.position, 'y')
//   .min(0)
//   .max(5)
//   .step(1)
//   .onChange(v => {
//     console.log(v);
//   })
//   .onFinishChange(v => {
//     console.log('finish');
//   })



//初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(500 , 500)

//将webgl渲染的canves内容添加到body
// document.body.appendChild(renderer.domElement)

//使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)
export const sceneRenderer = renderer



//  创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//    设置阻尼，必须在动画循环里调用update
controls.enableDamping = true

//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper( 5 );
scene.add(axesHelper)
