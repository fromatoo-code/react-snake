import React, { useState } from 'react';
import styled from 'styled-components';

import { SliderPicker } from 'react-color'

import {
  LOCAL_SPEED,
  DEFAULT_GRID,
  LOCAL_GRID,
  DEFAULT_SPEED,
  COLOURS,
  LOCAL_HEAD_COLOR,
  LOCAL_TAIL_COLOR,
  LOCAL_PRAY,
  DEFAULT_PRAY,
  ANIMALS,
  FOOD,
  PEOPLE,
  LOCAL_SNAKE_SHAPE,
  DEFAULT_SNAKE_SHAPE,
 } from '../utils/variables';
import { addToLocalStorage, loadFromLocalStorage } from '../utils/storageUtils';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Setting = styled.div`
  margin: auto;
  flex-direction: row;
  display: flex;
  margin-bottom: 20px;
  & > div {
    margin: 5px;
  }
`;

const Name = styled.div`
  font-family: 'Nova Slim', cursive;
  width: 150px;
  text-align: ${props => (props.center ? 'center' : 'right')};
`;

const Selection = styled.div`
  font-family: 'Nova Slim', cursive;
  width: 150px;
  text-align: left;
`;

const Button = styled.button`
  font-family: 'Nova Slim', cursive;
  position: relative;
  bottom: 3px;
`;

export default () => {
  const numbers = [];
  for (let i = 1; i <= 20; i +=1) numbers.push(i);

  const [speed, changeSpeed] = useState(loadFromLocalStorage(LOCAL_SPEED, DEFAULT_SPEED));
  const [grid, changeGrid] = useState(loadFromLocalStorage(LOCAL_GRID, DEFAULT_GRID));
  const [pray, changePray] = useState(loadFromLocalStorage(LOCAL_PRAY, DEFAULT_PRAY));
  const [headColor, changeHeadColor] = useState(loadFromLocalStorage(LOCAL_HEAD_COLOR, COLOURS.snakeHead));
  const [tailColor, changeTailColor] = useState(loadFromLocalStorage(LOCAL_TAIL_COLOR, COLOURS.snakeTail));
  const [shape, changeSnakeshape] = useState(loadFromLocalStorage(LOCAL_SNAKE_SHAPE, DEFAULT_SNAKE_SHAPE));

  const updateSpeed = (sp) => {
    addToLocalStorage(sp, LOCAL_SPEED);
    changeSpeed(sp);
  }

  const updateGrid = (gr) => {
    addToLocalStorage(gr, LOCAL_GRID);
    changeGrid(gr);
  }

  const updatePray = (pr) => {
    addToLocalStorage(pr, LOCAL_PRAY);
    changePray(pr);
  }

  const updateSnakeShape = (sh) => {
    const v = sh === 'round';
    addToLocalStorage(v, LOCAL_SNAKE_SHAPE);
    changeSnakeshape(v);
  }

  const updateHeadColor = (hc) => {
    addToLocalStorage(hc, LOCAL_HEAD_COLOR);
    changeHeadColor(hc);
  }

  const updateTailColor = (tc) => {
    addToLocalStorage(tc, LOCAL_TAIL_COLOR);
    changeTailColor(tc);
  }

  return (
    <SettingsContainer>
      <Setting>
        <Name>SPEED</Name>
        <Selection>
          <select onChange={(e) => updateSpeed(e.target.value)} value={speed}>
            {numbers.slice(0, 10).map(nr => <option key={nr}>{nr}</option>)}
          </select>
        </Selection>
      </Setting>
      <Setting>
        <Name>GRID</Name>
        <Selection>
          <select onChange={(e) => updateGrid(e.target.value)} value={grid}>
            {numbers.slice(2, 20).map(nr => <option key={nr}>{nr}</option>)}
          </select>
        </Selection>
      </Setting>
      <Setting>
        <Name>PRAY</Name>
        <Selection>
          <select onChange={(e) => updatePray(e.target.value)} value={pray}>
            <option>{ANIMALS}</option>
            <option>{FOOD}</option>
            <option>{PEOPLE}</option>
          </select>
        </Selection>
      </Setting>
      <Setting>
        <Name>SNAKE SHAPE</Name>
        <Selection>
          <select onChange={(e) => updateSnakeShape(e.target.value)} value={shape ? 'round' : 'square'}>
            <option>round</option>
            <option>square</option>
          </select>
        </Selection>
      </Setting>
      <Setting>
        <Name>SNAKE HEAD</Name>
        <Selection>
          <Button onClick={() => updateHeadColor(COLOURS.snakeHead)}>
            RESET
          </Button>
        </Selection>
      </Setting>
      <Setting>
        <div style={{ width: '300px' }}>
          <SliderPicker
            color={headColor}
            onChangeComplete={color => updateHeadColor(color.hex)}
          />
        </div>
      </Setting>
      <Setting>
        <Name>SNAKE TAIL</Name>
        <Selection>
          <Button onClick={() => updateTailColor(COLOURS.snakeTail)}>
            RESET
          </Button>
        </Selection>
      </Setting>
      <Setting>
        <div style={{ width: '300px' }}>
          <SliderPicker
            color={tailColor}
            onChangeComplete={color => updateTailColor(color.hex)}
          />
        </div>
      </Setting>
    </SettingsContainer>
  )
}
