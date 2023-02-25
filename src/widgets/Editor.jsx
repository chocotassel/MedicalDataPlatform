import React from 'react'

import { sceneRenderer } from '../utils/scene'


function Editor() {

  const mainView = React.createRef()
  const topView = React.createRef()
  const leftView = React.createRef()
  const frontView = React.createRef()

  React.useEffect(() => {
    mainView.current.appendChild(sceneRenderer.domElement) 
    // topView.current.appendChild(sceneRenderer.domElement) 
    // leftView.current.appendChild(sceneRenderer.domElement) 
    // frontView.current.appendChild(sceneRenderer.domElement) 
  }, [])

  return (
    <div className='min-h-full flex-1 grid grid-cols-2'>
      <div className='border-2' ref={mainView}></div>
      <div className='border-2' ref={topView}></div>
      <div className='border-2' ref={leftView}></div>
      <div className='border-2' ref={frontView}></div>
    </div>
  )
}

export default Editor