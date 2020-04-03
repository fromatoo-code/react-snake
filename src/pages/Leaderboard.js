import React, { useState } from 'react';
import styled from 'styled-components';

import { LOCAL_SPEED, LOCAL_GRID, DEFAULT_SPEED, DEFAULT_GRID, LOOCAL_USERNAME, LOOCAL_BEST } from '../utils/variables';
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

export default () => {
  const speed = loadFromLocalStorage(LOCAL_SPEED, DEFAULT_SPEED);
  const grisSize = loadFromLocalStorage(LOCAL_GRID, DEFAULT_GRID);
  const [username, setUsername] = useState(loadFromLocalStorage(LOOCAL_USERNAME || ''));

  const key = `${LOOCAL_BEST}${grisSize}`;
  const results = loadFromLocalStorage(key || []);

  const updateUserName = (name) =>{
    addToLocalStorage(name, LOOCAL_USERNAME);
    setUsername(name);
  };
  return (
    <Wrapper>
      <Input placeholder="username" value={username} onChange={(e) => updateUserName(e.target.value)}></Input>
      <Intro>{`${username ? `${username}, y`: 'Y'}ou are playing on a size-${grisSize} grid`}</Intro>
      <Intro>The best results for this grid on this browser are:</Intro>
      {results && results.map((data, i) =>
        <ResultData key={`${i}-${data.name}-${data.score}-${data.speed}`}>
          {i + 1}. <ResultName>{data.name}</ResultName>{` - ${data.score} at speed ${data.speed}`}
        </ResultData>)}
    </Wrapper>
  )
};
