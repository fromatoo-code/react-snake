import React, { useState } from 'react';
import GithubCorner from 'react-github-corner';
import styled from 'styled-components';

import ReactSnake from './components/ReactSnake';
import CanvasSnake from './components/CanvasSnake';
import { Button } from './components/SharedComponents';

const SelectionContainer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

function App() {
  const [flexSnake, changeSnake] = useState(true);
  return (
    <div className="App">
      <GithubCorner href="https://github.com/askokr/react-snake" />
      <SelectionContainer>
        <Button onClick={() => changeSnake(!flexSnake)}>
          {flexSnake ? 'Play canvas snake' : 'Play flexbox snake'}
        </Button>
      </SelectionContainer>
      {flexSnake
      ? <ReactSnake />
      : <CanvasSnake />}

    </div>
  );
}

export default App;
