import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import CanvasSnake from './pages/CanvasSnake';
import FlexSnake from './pages/ReactSnake';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';

const Title = styled.h1`
  text-align: center;
  font-family: 'Nova Slim', cursive;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function App() {
  return (
    <div className="App">
      <Title><StyledLink to="/">SNAKE</StyledLink></Title>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/canvassnake" component={CanvasSnake} exact />
        <Route path="/flexsnake" component={FlexSnake} exact />
        <Route path="/settings" component={Settings} exact />
        <Route path="/leaderboard" component={Leaderboard} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
