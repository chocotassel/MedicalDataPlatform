import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Col, Row } from 'antd'
import { useNavigate } from 'react-router'
import { useDispatch} from 'react-redux';
import { useState } from 'react';
import { signIn, setUser } from '../store/modules/signState'
import './Login.css'

const Login = () => {
  // 路由跳转
  const navigate = useNavigate()
  // 状态管理
  const [ userName, setUserName]=useState('')
  const [ passWord, setPassWord]=useState('')
  // 设置状态
  const dispatch=useDispatch()
  const onFinish = values => {
    console.log('Received values of form: ', values)
    dispatch(signIn())
    dispatch(setUser(userName))
    navigate('/')
  }
  return (
    <Row className='login-body' style={{marginTop: '10vh'}}>
      <Col span={8} offset={8}>
      <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true
      }}
      onFinish={onFinish}
      style={{
        marginTop: "10vh", 
        padding: "50px", 
      }}
      size='large'
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: '请输入用户名!'
          }
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="用户名"
          onChange={(e)=>{setUserName(e.target.value)}}
          value={userName}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码!'
          }
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
          onChange={(e)=>{setPassWord(e.target.value)}}
          value={passWord}
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          className="login-form-button"
        >
         登录
        </Button>
      </Form.Item>
    </Form>
      </Col>
    </Row>
  )
}
export default Login