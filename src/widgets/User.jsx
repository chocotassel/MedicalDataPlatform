import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space, Dropdown,Button } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import {signOut} from '../store/signState'

const User=()=> {
  const {value,user}=useSelector((state) => state.sign);   // 获取登录状态
  const dispatch = useDispatch();   // 修改登录状态
  // 退出按钮
  const items = [
    {
      key: '1',
      label: (
        <Button type="primary" onClick={Signout}>退出</Button>
      ),
    }]
  // 退出
  function Signout(){
    dispatch(signOut())
  }
  // 条件渲染
  if(value)
    return (
      <Space size={16} wrap style={{float:'right'}}>
        {/* 头像 */}
        <Dropdown
          menu={{
           items,
          }}
          placement="bottomLeft"
        >
          <Avatar
            style={{ backgroundColor: '#1677FF' }}
            icon={<UserOutlined />}
          />
        </Dropdown>
        {/* 用户名 */}
        <span style={{color:'#1677FF'}}>{user}</span>
      </Space>)
  else
    return(<Link to='/login' style={{float:'right', marginRight:'20px'}}><Button type="primary">登录</Button></Link>)
}
export default User;