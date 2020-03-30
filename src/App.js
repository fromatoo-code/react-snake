import React, { useState } from 'react';
import GithubCorner from 'react-github-corner';

import ReactSnake from './components/ReactSnake';
import CanvasSnake from './components/CanvasSnake';
import { Button } from './components/SharedComponents';

function App() {
  const [flexSnake, changeSnake] = useState(true);
  return (
    <div className="App">
      <GithubCorner href="https://github.com/askokr/react-snake" />
      <div>
        <Button onClick={() => changeSnake(!flexSnake)}>
          {flexSnake ? 'Play canvas snake' : 'Play flexbox snake'}
        </Button>
      </div>
      {flexSnake
      ? <ReactSnake />
      : <CanvasSnake />}

    </div>
  );
}

export default App;
