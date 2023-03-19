import { useRoutes} from 'react-router-dom'
import Home from './pages/Home'
import Show from './pages/Show';
import Adjust from './widgets/Adjust'
import Lables from './widgets/Lables'
import Login from './widgets/Login'
import Editor from './widgets/Editor'
import Upload from './widgets/Upload';

function App(){
  let element=useRoutes([{
    path:'/',
    element: <Home/>,
    children: [{
        path:'/',
        element: <Show/>,
        children: [{
          path: '/upload',
          element: <Upload />
        },{
          path: '/',
          element: <Editor />
        },{
          path: '/login',
          element: <Login />
        }]
      },{
        path:'/optimization',
        element: <Adjust />
      },{
        path:'/lables',
        element: <Lables/>
      }
    ]
  }])
  return element
}

export default App
