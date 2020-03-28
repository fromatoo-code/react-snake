import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ROWS = 10;
const COLUMNS = 10;
const GRID_WIDTH = 500
const GRID_HEIGHT = 500
const GRID_ITEM_WIDTH = GRID_WIDTH / ROWS;
const GRID_ITEM_HEIGHT = GRID_HEIGHT / COLUMNS;
const TICK = 500;
const HEAD_ROUNDNESS = '70px';

//conrols
const RIGHT = 'right';
const LEFT = 'left';
const UP = 'up';
const DOWN = 'down';

const animals = [
  '🐶',
  '🐺',
  '🦊',
  '🐱',
  '🐯',
  '🐵',
  '🐷',
  '🐴',
  '🐗',
  '🐼',
  '🐨',
  '🐮',
  '🐻',
  '🐰',
  '🐹',
  '🐭',
  '🐓',
  '🦃',
  '🐦',
  '🦅',
  '🦉',
  '🦆',
  '🐧',
  '🐢',
  '🐙',
  '🦀',
  '🦐',
  '🐋',
  '🐟',
  '🐠',
  '🐡',
  '🦈',
  '🐬',
];

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

const getStartFood = () => {
  let startFoodPosition = getRandomGrid();
  while (startFoodPosition === getCenterOfGrid()) startFoodPosition = getRandomGrid();
  return startFoodPosition;
}

let DIRECTION = RIGHT;
let FOOD_POSITION = getStartFood();
let PRAY = getAnimal();
let SNAKE_TAIL = [];
let SCORE = 0;

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
  outline: 3px solid grey;
`;

const GridItem = styled.div`
  width: ${GRID_ITEM_WIDTH}px;
  height: ${GRID_ITEM_HEIGHT}px;
  text-align: center;
  line-height: ${GRID_ITEM_HEIGHT}px;
  font-size: ${GRID_ITEM_HEIGHT * 0.7}px;
  ${props => props.gamelost && 'background-color: yellow;'}
  ${props => props.snakehead && 'background-color: black;'}
  ${props => props.snaketail && 'background-color: blue;'}
  ${props => props.victory && 'background-color: green;'}
  ${props => props.snakehead && getDirection()}
`;

const Controls = styled.div`
  margin: auto;
`;

const Button = styled.button`
  font-family: 'Nova Slim', cursive;
  font-size: 25px;
`;

const Score = styled.div`
  font-family: 'Nova Slim', cursive;
  font-size: 52px;
  text-align: center;
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

const Snake = () => {
  // keep track of grid and snake head
  const [grid, updateGrid] = useState([]);
  const [snakeHead, updateSnakeHead] = useState(getCenterOfGrid());
  const [gameRunning, changeGameRunning] = useState(false);
  const [gameLost, changeGameLost] = useState(false);
  // refs used to keep track of vars and update values within setTimeout
  const runningRef = useRef(gameRunning);
  runningRef.current = gameRunning;
  const scoreRef = useRef(SCORE);
  scoreRef.current = SCORE;

  const loseGame = () => {
    changeGameRunning(false);
    changeGameLost(true);
  }

  // controls
  const handleKeys = (keyPress) => {
    const { key } = keyPress;
    let newDirection;
    switch (key) {
      case 'ArrowUp':
      case 'w':
        newDirection = UP;
        break;
      case 'ArrowDown':
      case 's':
        newDirection = DOWN;
        break;
      case 'ArrowLeft':
      case 'a':
        newDirection = LEFT;
        break;
      case 'ArrowRight':
      case 'd':
        newDirection = RIGHT;
        break;
      default:
        break;
    }
    if (checkNoReverse(newDirection, DIRECTION, SNAKE_TAIL.length)) loseGame();
    DIRECTION = newDirection;
  }

  // handle grid data updates
  const drawGrid = () => {
    const newGrid = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLUMNS; col += 1) {
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
        let newFoodPosition = getRandomGrid();
        while ((checkTailIntersection(newFoodPosition, newTail)
        || (newFoodPosition.col === newPos.col && newFoodPosition.row === newPos.row))
        && newTail.length + 1 !== COLUMNS * ROWS) newFoodPosition = getRandomGrid();
        FOOD_POSITION = newFoodPosition;
        // increment socore
        SCORE = SCORE += 1;
        PRAY = getAnimal();
      }

      SNAKE_TAIL = newTail;

      // check if game is lost
      const outOfBounds = () => (newPos.col > COLUMNS - 1
        || newPos.col < 0
        || newPos.row > ROWS - 1
        || newPos.row < 0);
      if (outOfBounds() || checkTailIntersection(newPos, newTail)) loseGame()
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

  // start button
  const handleClick = () => {
    // reset all values on game end
    if (gameLost) {
      DIRECTION = RIGHT;
      SNAKE_TAIL = [];
      FOOD_POSITION = getStartFood();
      SCORE = 0;
      updateSnakeHead(getCenterOfGrid());
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
        <Score>{scoreRef.current}</Score>
      </Controls>
      <Grid>
        {grid.map(item =>
          <GridItem
            gamelost={gameLost}
            key={item.row.toString() + '-' + item.col.toString()}
            snakehead={item.isSnakeHead}
            snaketail={item.isSnakeTail}
            victory={SNAKE_TAIL.length + 1 === COLUMNS * ROWS}
          >
            {item.isFood && PRAY}
          </GridItem>)}
      </Grid>
    </Container>
  );
}

export default Snake;
