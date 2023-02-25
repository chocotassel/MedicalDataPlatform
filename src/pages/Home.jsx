import React from 'react'

import Header from '../widgets/Header';
import FileList from '../widgets/FileList';
import Editor from '../widgets/Editor';
import Toolbar from '../widgets/Toolbar';

function Home() {
  return (
    <div className='flex flex-col min-h-screen mx-auto p-4'>
      <Header />
      <section className='flex-auto flex'>
        <FileList />
        <Editor />
        <Toolbar />
      </section>
    </div>
  )
}

export default Home