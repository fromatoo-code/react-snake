// inspired by https://medium.com/swlh/how-i-created-a-snake-game-in-react-7743fc599084

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, Container, Controls, Score } from './SharedComponents';
import { getNewDirection } from '../utils/functions';
import { UP, RIGHT, DOWN, LEFT, animals, COLOURS } from '../utils/variables';

const HEAD_ROUNDNESS = '70px';

const getAnimal = () => animals[Math.floor(Math.random() * (animals.length - 1))];

const getDirection = () => {
  let borderRadius = 'border-radius: ';
  if (SNAKE_TAIL.length === 0) { return  borderRadius + HEAD_ROUNDNESS };
  switch (DIRECTION) {
    case UP:
      borderRadius = borderRadius + `${HEAD_ROUNDNESS} ${HEAD_ROUNDNESS} 0 0`;
      break;
    case LEFT:
      borderRadius = borderRadius + `${HEAD_ROUNDNESS} 0 0 ${HEAD_ROUNDNESS}`;
      break;
    case DOWN:
      borderRadius = borderRadius + `0 0 ${HEAD_ROUNDNESS} ${HEAD_ROUNDNESS}`;
      break;
    default:
      borderRadius = borderRadius + `0 ${HEAD_ROUNDNESS} ${HEAD_ROUNDNESS} 0`;
  }
  return borderRadius;
}

const getRandomGrid = (gridSize) => {
  return {
    row: Math.floor(Math.random() * gridSize),
    col: Math.floor(Math.random() * gridSize),
  }
}

const getCenterOfGrid = (gridSize) => ({
  row: Math.floor((gridSize - 1) / 2),
  col: Math.floor((gridSize - 1) / 2),
})

const getStartFood = (gridSize) => {
  let startFoodPosition = getRandomGrid(gridSize);
  if (startFoodPosition.col === getCenterOfGrid().col && startFoodPosition.row === getCenterOfGrid(gridSize).row) {
    return getStartFood(gridSize);
  };
  return startFoodPosition;
}

let DIRECTION = RIGHT;
let FOOD_POSITION = {};
let PRAY = getAnimal();
let SNAKE_TAIL = [];

const Grid = styled.div`
  width: ${props => props.gridSide};
  height: ${props => props.gridSide};
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  outline: 3px solid grey;
  background-color: ${COLOURS.background};
  ${props => props.gamelost && `background-color: ${COLOURS.backgroundLoss};`}
  ${props => props.victory && `background-color: ${COLOURS.backgroundVictory};`}
`;

const GridItem = styled.div`
  width: ${props => props.gridItemSide};
  height: ${props => props.gridItemSide};
  text-align: center;
  line-height: ${props => props.gridItemSide};
  font-size: ${props => `calc(${props.gridItemSide} * 0.7)`};
  ${props => props.snakehead && `background-color: ${COLOURS.snakeHead};`}
  ${props => props.snaketail && `background-color: ${COLOURS.snakeTail};`}
  ${props => props.victory && `background-color: ${COLOURS.backgroundVictory};`}
  ${props => props.snakehead && getDirection()};
`;

const MobileControls = styled.div`
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

const checkNoReverse = (newDir, oldDir, length) => {
  if (length === 0) return false;
  if ((newDir === LEFT && oldDir === RIGHT)
    || (newDir === RIGHT && oldDir === LEFT)
    || (newDir === UP && oldDir === DOWN)
    || (newDir === DOWN && oldDir === UP)) return true
}

const checkTailIntersection = (block, tail) => (
  tail.findIndex(segment => segment.col === block.col && segment.row === block.row) !== -1);

const Snake = ({ gridItemSide, gridSide, gridSize, tick }) => {
  // keep track of grid and snake head
  const [grid, updateGrid] = useState([]);
  const [snakeHead, updateSnakeHead] = useState(getCenterOfGrid(gridSize));
  const [gameRunning, changeGameRunning] = useState(false);
  const [gameLost, changeGameLost] = useState(false);
  // refs used to keep track of vars and update values within setTimeout
  const runningRef = useRef(gameRunning);
  runningRef.current = gameRunning;

  const loseGame = () => {
    changeGameRunning(false);
    changeGameLost(true);
  }

  const reset = () => {
    DIRECTION = RIGHT;
    SNAKE_TAIL = [];
    FOOD_POSITION = getStartFood(gridSize);
    updateSnakeHead(getCenterOfGrid(gridSize));
  }

  // controls
  const handleKeys = (keyPress) => {
    const { key } = keyPress;
    const newDirection = getNewDirection(key);
    if (checkNoReverse(newDirection, DIRECTION, SNAKE_TAIL.length)) loseGame();
    DIRECTION = newDirection;
  }

  const mobileConroller = (dir) => {
    DIRECTION = dir;
  }

  // handle grid data updates
  const drawGrid = () => {
    const newGrid = [];
    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        newGrid.push({
          row,
          col,
          isFood: row === FOOD_POSITION.row && col === FOOD_POSITION.col,
          isSnakeHead: row === snakeHead.row && col === snakeHead.col,
          isSnakeTail: checkTailIntersection({col, row}, SNAKE_TAIL),
        });
      }
    }
    updateGrid(newGrid);
  }

  // init game
  useEffect(() => {
    // set start grid
    FOOD_POSITION = getStartFood(gridSize);
    drawGrid();
    // start listening to controlis
    window.addEventListener('keydown', handleKeys, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeys);
      // cancels ticer
      runningRef.current = false;
      reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // start game
  useEffect(() => {
    // handle snake movements
    const moveSnake = () => {
      let oldPos;
      let newPos = {};
      updateSnakeHead((prevPos) => {
        oldPos = prevPos;
        switch (DIRECTION) {
          case LEFT:
              newPos = { ...prevPos, col: prevPos.col - 1 };
            break;
          case UP:
              newPos = { ...prevPos, row: prevPos.row - 1 };
            break;
          case DOWN:
              newPos = { ...prevPos, row: prevPos.row + 1 };
            break;
          default:
              newPos = { ...prevPos, col: prevPos.col + 1 };
        }
        return newPos;
      });

      const newTail = [];
      const snakeEats = newPos.row === FOOD_POSITION.row && newPos.col === FOOD_POSITION.col;

      // update tail position
      for (let i = 0; i < SNAKE_TAIL.length; i += 1) {
        if (i === 0) {
          newTail.push(oldPos);
        } else newTail.push(SNAKE_TAIL[i - 1]);
      }
      // lengthen snake, when snake eats
      if (snakeEats) {
        if (SNAKE_TAIL.length  === 0) {
          newTail.push(oldPos);
        } else newTail.push(SNAKE_TAIL[SNAKE_TAIL.length - 1]);
        // set new food position
        let newFoodPosition = getRandomGrid(gridSize);
        while ((checkTailIntersection(newFoodPosition, newTail)
        || (newFoodPosition.col === newPos.col && newFoodPosition.row === newPos.row))
        && newTail.length + 1 !== gridSize * gridSize) newFoodPosition = getRandomGrid(gridSize);
        FOOD_POSITION = newFoodPosition;
        PRAY = getAnimal();
      }

      SNAKE_TAIL = newTail;

      // check if game is lost
      const outOfBounds = () => (newPos.col > gridSize - 1
        || newPos.col < 0
        || newPos.row > gridSize - 1
        || newPos.row < 0);
      if (outOfBounds() || checkTailIntersection(newPos, newTail)) loseGame()
    }

    // game tick
    const gameTick = () => {
      if (runningRef.current) {
        moveSnake();
        setTimeout(gameTick , tick);
      }
    };

    if (gameRunning) setTimeout(gameTick, tick);
    return () => {
      clearTimeout(gameTick);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameRunning])

  // update grid evety tick
  useEffect(() => {
    drawGrid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakeHead])

  // start button
  const handleClick = () => {
    // reset all values on game end
    if (gameLost) {
      reset();
      changeGameLost(false);
    };
    changeGameRunning(!gameRunning);
  };

  return (
    <Container>
      <Controls>
        <Button onClick={handleClick}>
          {gameRunning ? 'PAUSE' : 'START'}
        </Button>
        <Score>{SNAKE_TAIL.length}</Score>
      </Controls>
      <Grid
        gamelost={gameLost}
        gridSide={gridSide}
        victory={SNAKE_TAIL.length + 1 === gridSize * gridSize}
      >
        {grid.map(item =>
          <GridItem
            gridItemSide={gridItemSide}
            key={item.row.toString() + '-' + item.col.toString()}
            snakehead={item.isSnakeHead}
            snaketail={item.isSnakeTail}
            victory={SNAKE_TAIL.length + 1 === gridSize * gridSize}
          >
            {item.isFood && (SNAKE_TAIL.length + 1 === gridSize * gridSize ? '🎉' : PRAY)}
          </GridItem>)}
      </Grid>
      <MobileControls>
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
      </MobileControls>
    </Container>
  );
}

export default Snake;
