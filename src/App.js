import React, { useState } from 'react';
import GithubCorner from 'react-github-corner';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive'

import ReactSnake from './components/ReactSnake';
import CanvasSnake from './components/CanvasSnake';
import { Button } from './components/SharedComponents';

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: fit-content;
`;

const Settings = styled.div`
  margin-top: 10px;
`;

const Setting = styled.span`
  margin-right: 30px;
  font-family: 'Nova Slim', cursive;
`;

function App() {
  const [flexSnake, changeSnake] = useState(true);
  const [speed, changeSpeed] = useState(3);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)'});

  const DESKTOP_SIDE = 500;
  const MOBILE_SIDE = 90;
  const GRID_SIZE =  10;
  const GRID_SIDE =  isMobile ? MOBILE_SIDE : DESKTOP_SIDE;
  const GRID_SIDE_WITH_UNIT = `${GRID_SIDE}${isMobile ? 'vw' : 'px'}`;
  const GRID_ITEM_SIDE = (isMobile ? MOBILE_SIDE : DESKTOP_SIDE) / GRID_SIZE;
  const GRID_ITEM_SIDE_WITH_UNIT = `${GRID_ITEM_SIDE}${isMobile ? 'vw' : 'px'}`;
  const BASETICK = 1000;
  const TICK = BASETICK / speed;

  return (
    <div className="App">
      <GithubCorner href="https://github.com/askokr/react-snake" />
      <SelectionContainer>
        <Button onClick={() => changeSnake(!flexSnake)}>
          {flexSnake ? 'Play canvas snake' : 'Play flexbox snake'}
        </Button>
        <Settings>
          <Setting>SPEED</Setting>
          <select onChange={(e) => changeSpeed(e.target.value)} value={speed}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </Settings>
      </SelectionContainer>
      {flexSnake
      ? (
        <ReactSnake
          gridSide={GRID_SIDE_WITH_UNIT}
          gridItemSide={GRID_ITEM_SIDE_WITH_UNIT}
          gridSize={GRID_SIZE}
          tick={TICK}
        />
      ) : (
        <CanvasSnake
          gridSide={GRID_SIDE}
          gridSideWithUnit={GRID_SIDE_WITH_UNIT}
          gridItemSide={GRID_ITEM_SIDE}
          gridSize={GRID_SIZE}
          tick={TICK}
        />)}
    </div>
  );
}

export default App;
