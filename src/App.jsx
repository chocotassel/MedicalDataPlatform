import React from 'react';
import Home from './pages/Home';

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="App">
      <Home />
    </div>
  )
}

export default App
