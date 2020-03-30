import React, { useState } from 'react';
import GithubCorner from 'react-github-corner';

import ReactSnake from './components/ReactSnake';
import CanvasSnake from './components/CanvasSnake';

function App() {
  const [flexSnake, changeSnake] = useState(false);
  return (
    <div className="App">
      <GithubCorner href="https://github.com/askokr/react-snake" />
      <ReactSnake />
      {/* <button onClick={() => changeSnake(!flexSnake)}>Change Snake</button>
      {flexSnake
      ? <ReactSnake />
      : <CanvasSnake />} */}

    </div>
  );
}

export default App;
