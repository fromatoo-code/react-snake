import React, { useState } from 'react';
import styled from 'styled-components';

import { LOCAL_SPEED, LOCAL_GRID } from '../utils/variables';
import { addToLocalStorage, loadFromLocalStorage } from '../utils/storageUtils';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Setting = styled.div`
  margin: auto;
  flex-direction: row;
  display: flex;
  & > div {
    margin: 5px;
  }
`;

const Name = styled.div`
  font-family: 'Nova Slim', cursive;
  width: 100px;
  text-align: right;
`;

const Selection = styled.div`
  font-family: 'Nova Slim', cursive;
  width: 100px;
  text-align: left;
`;

export default () => {
  const numbers = [];
  for (let i = 1; i <= 20; i +=1) numbers.push(i);

  const [speed, changeSpeed] = useState(loadFromLocalStorage(LOCAL_SPEED, 3));
  const [grid, changeGrid] = useState(loadFromLocalStorage(LOCAL_GRID, 10));

  const updateSpeed = (sp) => {
    addToLocalStorage(sp, LOCAL_SPEED);
    changeSpeed(sp);
  }

  const updateGrid = (gr) => {
    addToLocalStorage(gr, LOCAL_GRID);
    changeGrid(gr);
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
    </SettingsContainer>
  )
}
