import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ROWS = 10;
const COLUMNS = 10;
const GRID_WIDTH = 500
const GRID_HEIGHT = 500
const GRID_ITEM_WIDTH = GRID_WIDTH / ROWS;
const GRID_ITEM_HEIGHT = GRID_HEIGHT / COLUMNS;
const TICK = 1000;

//conrols
const RIGHT = 'right';
const LEFT = 'left';
const UP = 'up';
const DOWN = 'down';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Grid = styled.div`
  width: ${GRID_WIDTH}px;
  height: ${GRID_WIDTH}px;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const GridItem = styled.div`
  outline: 1px solid grey;
  width: ${GRID_ITEM_WIDTH}px;
  height: ${GRID_ITEM_HEIGHT}px;
  ${props => props.food && 'background-color: red;'}
  ${props => props.snakehead && 'background-color: black;'}
  ${props => props.snaketail && 'background-color: blue;'}
`;

const Controls = styled.div`
  margin: auto;
`;

const getRandomGrid = () => {
  return {
    row: Math.floor(Math.random() * ROWS),
    col: Math.floor(Math.random() * COLUMNS),
  }
}

const getCenterOfGrid = () => ({
  row: Math.floor((ROWS - 1) / 2),
  col: Math.floor((COLUMNS - 1) / 2),
})

let direction = RIGHT;
let foodPosition = getRandomGrid();
let snakeTail = [];
let staticGameState = false;

const Snake = () => {
  // keep track of grid and snake head
  const [grid, updateGrid] = useState([]);
  const [snakeHead, updateSnakeHead] = useState(getCenterOfGrid());
  const [gameRunning, changeGameState] = useState(staticGameState);
  const runningRef = useRef(gameRunning);
  runningRef.current = gameRunning;

  // controls
  const handleKeys = (keyPress) => {
    const { key } = keyPress;
    switch (key) {
      case 'ArrowUp':
      case 'w':
        direction = UP;
        break;
      case 'ArrowDown':
      case 's':
        direction = DOWN;
        break;
      case 'ArrowLeft':
      case 'a':
        direction = LEFT;
        break;
      case 'ArrowRight':
      case 'd':
        direction = RIGHT;
        break;
      default:
        break;
    }
  }

  // handle grid data updates
  const drawGrid = () => {
    const newGrid = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLUMNS; col += 1) {
        newGrid.push({
          row,
          col,
          isFood: row === foodPosition.row && col === foodPosition.col,
          isSnakeHead: row === snakeHead.row && col === snakeHead.col,
          isSnakeTail: snakeTail.findIndex(segment => segment.col === col && segment.row === row) !== -1,
        });
      }
    }
    updateGrid(newGrid);
  }

  // init game
  useEffect(() => {
    // set start grid

    drawGrid();
    // start listening to controlis
    window.addEventListener('keydown', handleKeys, { passive: false });

    return () => window.removeEventListener(handleKeys);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // start game
  useEffect(() => {
    // handle snake movements
    const moveSnake = () => {
      let oldPos;
      let newPos;
      updateSnakeHead((prevPos) => {
        oldPos = prevPos;
        switch (direction) {
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
      const snakeEats = newPos.row === foodPosition.row && newPos.col === foodPosition.col;

      // update tail position
      for (let i = 0; i < snakeTail.length; i += 1) {
        if (i === 0) {
          newTail.push(oldPos);
        } else newTail.push(snakeTail[i - 1]);
      }
      // set new food position and lengthen snake, when snake eats
      if (snakeEats) {
        foodPosition = getRandomGrid();
        if (snakeTail.length  === 0) {
          newTail.push(oldPos);
        } else newTail.push(snakeTail[snakeTail.length - 1]);
      }

      snakeTail = newTail;
    }

    // game tick
    const gameTick = () => {
      if (runningRef.current) {
        moveSnake();
        setTimeout(gameTick , TICK);
      }
    };

    if (gameRunning) setTimeout(gameTick, TICK);
    return () =>  clearTimeout(gameTick);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameRunning])

  // update grid evety tick
  useEffect(() => {
    drawGrid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakeHead])

  const handleClick = () => {
    staticGameState = !staticGameState;
    changeGameState(!gameRunning);
  };

  return (
    <Container>
      <Controls>
        <button onClick={handleClick}>
          {gameRunning ? 'PAUSE' : 'START'}
        </button>
      </Controls>
      <Grid>
        {grid.map(item =>
          <GridItem
            key={item.row.toString() + '-' + item.col.toString()}
            food={item.isFood}
            snakehead={item.isSnakeHead}
            snaketail={item.isSnakeTail}
          />)}
      </Grid>
    </Container>
  );
}

export default Snake;
