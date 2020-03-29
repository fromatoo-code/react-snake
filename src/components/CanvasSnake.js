// inspired by https://www.instructables.com/id/How-to-Make-a-Snake-Game-in-JavaScript/

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const WIDTH = 500;
const HEIGHT = 500;
const PIXELS_X = 10;
const PIXELS_Y = 10;
const PIXEL_WIDTH = WIDTH / PIXELS_X;
const PIXEL_HEIGHT = HEIGHT / PIXELS_Y;

const TICK = 300;
const SCORE = 0;

//conrols
const RIGHT = 'right';
const LEFT = 'left';
const UP = 'up';
const DOWN = 'down';

// startic vars
let DIRECTION = RIGHT;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Canvas = styled.canvas`
  outline: 3px solid gray;
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

// controls
const handleKeys = (keyPress) => {
  const { key } = keyPress;
  let newDirection = DIRECTION;
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
  DIRECTION = newDirection;
}

const getCenterSquare = () => ({
  x: Math.floor((PIXELS_X - 1) / 2) * PIXEL_WIDTH,
  y: Math.floor((PIXELS_Y - 1) / 2) * PIXEL_HEIGHT,
})

const Snake = () => {
  const [gameCanvas, setCanvas] = useState(null);
  const [snake, updateSnake] = useState([getCenterSquare()]);
  const [gameRunning, changeGameRunning] = useState(false);
  const runningRef = useRef(gameRunning);
  runningRef.current = gameRunning;
  const snakeRef = useRef(snake);
  snakeRef.current = snake;
  const scoreRef = useRef(SCORE);
  scoreRef.current = SCORE;


  useEffect(() => {
    // get canvas
    setCanvas(document.getElementById("snakeCanvas"));
    // add controls listener
    window.addEventListener('keydown', handleKeys, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeys);
      runningRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (gameCanvas) {
      // Return a two dimensional drawing context
      const ctx = gameCanvas.getContext("2d");
      //  Select the colour for the border of the canvas
      ctx.strokestyle="brown";
      // Draw a "border" around the entire canvas
      ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

      const drawSnakePart = (snakePart) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(snakePart.x, snakePart.y, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.strokeRect(snakePart.x, snakePart.y, PIXEL_WIDTH, PIXEL_HEIGHT);
      }

      const drawSnake = () => {
        snakeRef.current.forEach(drawSnakePart);
      }

      const moveSnake = () => {
        let newSnakeHead;
        updateSnake((prevSnake) => {
          const snakeHead = prevSnake[0];
          switch (DIRECTION) {
            case LEFT:
              newSnakeHead = { ...snakeHead, x: snakeHead.x - PIXEL_WIDTH };
              break;
            case UP:
              newSnakeHead = { ...snakeHead, y: snakeHead.y - PIXEL_HEIGHT };
              break;
            case DOWN:
              newSnakeHead = { ...snakeHead, y: snakeHead.y + PIXEL_HEIGHT };
              break;
            default:
              newSnakeHead = { ...snakeHead, x: snakeHead.x + PIXEL_WIDTH };
          }
          return [newSnakeHead];
        });
      }

      // game tick
      const gameTick = () => {
        if (runningRef.current) {
          ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
          moveSnake();
          drawSnake();
          setTimeout(gameTick , TICK);
        }
      };

      drawSnake();

      if (gameRunning) setTimeout(gameTick, TICK);
      return () => clearTimeout(gameTick);

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCanvas, gameRunning]);

  const handleClick = () => {
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
      <Canvas id="snakeCanvas" height={`${HEIGHT}px`} width={`${WIDTH}px`} />
    </Container>
  )
}

export default Snake;
