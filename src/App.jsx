import React from 'react';
import Home from './pages/Home';
import * as THREE from 'three';

THREE.Cache.enabled = true;

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="App">
      <Home />
    </div>
  )
}

export default App
