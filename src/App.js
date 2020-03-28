import React from 'react';
import GithubCorner from 'react-github-corner';

import ReactSnake from './components/ReactSnake';

function App() {
  return (
    <div className="App">
      <GithubCorner href="https://github.com/askokr/react-snake" />
      <ReactSnake />
    </div>
  );
}

export default App;
