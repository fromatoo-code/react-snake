import React from 'react';
import styled from 'styled-components';
import { Link as ReactLink } from 'react-router-dom';

import { UP, RIGHT, DOWN, LEFT } from '../utils/variables';

export const Button = styled.button`
  font-family: 'Nova Slim', cursive;
  font-size: 25px;
`;

export const Container = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Controls = styled.div`
  margin: auto;
`;

export const Score = styled.div`
  font-family: 'Nova Slim', cursive;
  font-size: 52px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const Link = styled(ReactLink)`
text-decoration: none;
color: inherit;
`;

const MobileControlsWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 90vw;
  justify-content: ${props => (props.spaced ? 'space-between' : 'center')};
`;

const ControlButon = styled.button`
  padding: 10px 30px;
`;

export const MobileControls = ({ mobileConroller }) => (
  <MobileControlsWrapper>
    <Row>
      <ControlButon onClick={() => mobileConroller(UP)}>⬆</ControlButon>
    </Row>
    <Row spaced>
      <ControlButon onClick={() => mobileConroller(LEFT)}>⬅</ControlButon>
      <ControlButon onClick={() => mobileConroller(RIGHT)}>➡</ControlButon>
    </Row>
    <Row>
      <ControlButon onClick={() => mobileConroller(DOWN)}>⬇</ControlButon>
    </Row>
  </MobileControlsWrapper>
);
