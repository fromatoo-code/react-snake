import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 80vh;
`;

const Title = styled.h1`
  font-family: 'Nova Slim', cursive;
  margin: auto;
`;

export default () => (
  <Wrapper>
    <Title>NOT FOUND</Title>
  </Wrapper>
);
