import React from 'react';
import Home from './pages/Home';
import * as THREE from 'three';

THREE.Cache.enabled = true;

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  )
}

export default App
