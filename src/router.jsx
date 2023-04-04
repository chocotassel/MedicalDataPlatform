import { useRoutes} from 'react-router-dom'
import Home from './pages/Home'
import Show from './pages/Show';
import Adjust from './widgets/Adjust'
import Labels from './widgets/Labels'
import Login from './components/Login'
import Upload from './widgets/Upload';
import Editor from './widgets/Editor';

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
          path: '/editor',
          element: <Editor />
        },{
          path: '/login',
          element: <Login />
        }]
      },{
        path:'/optimization',
        element: <Adjust />
      },{
        path:'/labels',
        element: <Labels/>
      }
    ]
  }])
  return element
}

export default App
