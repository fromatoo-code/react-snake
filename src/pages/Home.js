import React from 'react';
import GithubCorner from 'react-github-corner';
import styled from 'styled-components';

import { Link } from '../components/SharedComponents';

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Selection = styled.div`
  display: block;
  font-family: 'Nova Slim', cursive;
  padding: 30px;
  background-color: aquamarine;
  border: 2px solid brown;
`;

const LinkWrapper = styled(Link)`
  width: 200px;
  margin: 20px auto;
  text-decoration: none;
`;

function App() {
  return (
    <div className="App">
      <GithubCorner href="https://github.com/askokr/react-snake" />
      <SelectionContainer>
        <LinkWrapper to="/flexsnake"><Selection>FLEX SNAKE</Selection></LinkWrapper>
        <LinkWrapper to="canvassnake"><Selection>CANVAS SNAKE</Selection></LinkWrapper>
        <LinkWrapper to="settings"><Selection>SETTINGS</Selection></LinkWrapper>
      </SelectionContainer>
    </div>
  );
}

export default App;
