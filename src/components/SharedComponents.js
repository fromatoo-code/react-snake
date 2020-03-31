import styled from 'styled-components';

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
