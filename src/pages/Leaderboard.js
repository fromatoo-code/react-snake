import React, { useState } from 'react';
import styled from 'styled-components';

import { LOCAL_SPEED, LOCAL_GRID, DEFAULT_SPEED, DEFAULT_GRID, LOOCAL_USERNAME } from '../utils/variables';
import { loadFromLocalStorage, addToLocalStorage } from '../utils/storageUtils';

const Wrapper = styled.div`
  text-align: center;
`;

const Input = styled.input`
  font-family: 'Nova Slim', cursive;
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
`;

const Intro = styled.p`
  font-family: 'Nova Slim', cursive;
`;

const ResultData = styled.p`
  font-family: 'Nova Slim', cursive;
`;

const ResultName = styled.span`
  font-family: 'Nova Slim', cursive;
  font-weight: bold;
`;

const mockData = [
  { name: 'Asko', result: '10', speed: '3', },
  { name: 'Kristina', result: '9', speed: '3', },
  { name: 'Ergo', result: '8', speed: '3', },
  { name: 'Triin', result: '7', speed: '3', },
  { name: 'Asko2', result: '6', speed: '3', },
  { name: 'Asko3', result: '5', speed: '3', },
  { name: 'Asko4', result: '4', speed: '3', },
  { name: 'Asko5', result: '3', speed: '3', },
  { name: 'Asko6', result: '2', speed: '3', },
  { name: 'Asko7', result: '2', speed: '2', },
];

export default () => {
  const speed = loadFromLocalStorage(LOCAL_SPEED, DEFAULT_SPEED);
  const grisSize = loadFromLocalStorage(LOCAL_GRID, DEFAULT_GRID);
  const [username, setUsername] = useState(loadFromLocalStorage(LOOCAL_USERNAME || ''));

  const updateUserName = (name) =>{
    addToLocalStorage(name, LOOCAL_USERNAME);
    setUsername(name);
  }
  return (
    <Wrapper>
      <Input placeholder="username" value={username} onChange={(e) => updateUserName(e.target.value)}></Input>
      <Intro>{`${username ? `${username}, y`: 'Y'}ou are playing with on a size-${grisSize} grid at speed ${speed}`}</Intro>
      <Intro>The best results for this grid on this browser are:</Intro>
      {mockData.map(data =>
        <ResultData key={`${data.name}-${data.result}-${data.speed}`}>
          <ResultName>{data.name}</ResultName>{` - ${data.result} at speed ${data.speed}`}
        </ResultData>)}
    </Wrapper>
  )
};
