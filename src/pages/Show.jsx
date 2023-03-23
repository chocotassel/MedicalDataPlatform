import Editor from '../widgets/Editor'
import { useSelector } from 'react-redux'
import Login from '../components/Login'
import { Outlet } from 'react-router'

const Show=()=>{
    // const {value,user}=useSelector((state) => state.sign);   // 获取登录状态
    // if(value){
    //     return(
    //     // <div style={{display:'flex',alignItems:'flex-start'}}>
    //     <Outlet />
    //     // </div>
    //     )
    // }else{
    //     return(<Login />)
    // }
    return(
        // <div style={{display:'flex',alignItems:'flex-start'}}>
        <Outlet />
        // </div>
        )
}
export default Show