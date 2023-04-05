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

  // 变量
  const [isResizing, setIsResizing] = useState(false);
  const editorRef = useRef(null);
  const initialSize = useRef({ width: 0, height: 0 });
  const initialMousePosition = useRef({ x: 0, y: 0 });


  // 拉动修改工作区大小
  function handleMouseMove(e) {
    if (!isResizing || !editorRef.current) return;

    const dx = e.clientX - initialMousePosition.current.x;
    const dy = e.clientY - initialMousePosition.current.y;

    const ratio = initialSize.current.width / initialSize.current.height;

    const newWidth = initialSize.current.width + dx;
    const newHeight = newWidth / ratio;

    editorRef.current.width = newWidth;
    editorRef.current.height = newHeight;
    editorRef.current.style.width = `${newWidth}px`;
    editorRef.current.style.height = `${newHeight}px`;
  }

  function handleMouseDown(e) {
    if (!editorRef.current) return;

    initialSize.current = {
      width: editorRef.current.width,
      height: editorRef.current.height
    };
    initialMousePosition.current = { x: e.clientX, y: e.clientY };
    setIsResizing(true);
  };

  function handleMouseUp(){
    setIsResizing(false);
  };


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
          
          {/* <div
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsResizing(false)}
            style={{
              cursor: isResizing ? 'nwse-resize' : 'default',
              userSelect: 'none'
            }}
          > */}
            <Editor />
          <Selector /> 
            {/* <div
              onMouseDown={handleMouseDown}
              style={{
                position: 'relative',
                left: `${editorRef.current ? editorRef.current.width - 10 : 290}px`,
                top: `${editorRef.current ? editorRef.current.height - 10 : 140}px`,
                width: '10px',
                height: '10px',
                backgroundColor: 'black',
                cursor: 'nwse-resize'
              }}
            />
          </div> */}
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