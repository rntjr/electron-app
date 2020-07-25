import React from 'react';
import ReactDom from 'react-dom';

const App = () => {
  return (
    <h1>
      Hi from a react app
    </h1>
  )
}

ReactDom.	render(<App />, document.getElementById('root'))