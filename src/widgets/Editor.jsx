import React from 'react'

import MainView from './Editor/MainView'
import TopView from './Editor/TopView'
import LeftView from './Editor/LeftView'
import FrontView from './Editor/FrontView'

function Editor() {

  React.useEffect(() => {

  }, [])

  return (
    <div className='min-h-full flex-1 grid grid-cols-2'>
      <MainView/>
      <TopView/>
      <LeftView/>
      <FrontView/>
    </div>
  )
}

export default Editor