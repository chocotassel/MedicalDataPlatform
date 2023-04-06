import { useState, useRef } from 'react';
import { Outlet,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, theme } from 'antd';

import './Home.css'
import User from '../components/User';
import Toolbar from '../widgets/Toolbar'
import Editor from '../widgets/Editor';
import Selector from '../widgets/Selector'

import { setScaleFactor } from '../store/modules/scaleFactorState';


const { Header, Content, Footer } = Layout;
const App = () => {
  // 路由跳转
  const navigate = useNavigate()

  function goTo(e){
    switch (e.key){
      case '1': 
        navigate('/')
        break
      case '2': 
        navigate('/optimization')
        break
      case '3': 
        navigate('/labels')
        break
    }
  }

  // redux
  const scaleFactor = useSelector((state) => state.scaleFactor.value)
  const dispatch = useDispatch();

  const objSrc = '/public/objs/nii2mesh_0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.obj'
  const src = '/src/assets/submit/0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.nii/0f593c1e-4bb8-470f-a87b-fee3dbd3b3ed.nii'
  const originSrc = '/src/assets/0b2be9e0-886b-4144-99f0-8bb4c6eaa848.nii'


  return (
    <Layout className="layout">
      <Header id='components-layout-top'>
        <h1 className="logo">基于百度飞桨的3D医疗数据智能解析平台</h1>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[{key:1,label:'分析'},{key:2,label:'优化'},{key:3,label:'标签'}]}
          style={{display:'inline-block'}}
          onClick={(e)=>goTo(e)}
        />
        <User sign={true} user={'jshfa'}/>
      </Header>
      <Content>
        <div
          className="site-layout-content"
          style={{
            padding:0,
            display: 'flex',
            backgroundColor: 'F5F5F5'
          }}
        >
          <Toolbar />
          <Outlet/>
          
          <Editor src={src} objSrc={objSrc} />
          <Selector /> 
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: '#001529',
          color: '#fff'
        }}
      >
        作者：医眼盯诊团队
      </Footer>
    </Layout>
  );
};
export default App;