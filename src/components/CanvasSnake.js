// inspired by https://www.html5canvastutorials.com/advanced/html5-canvas-snake-game/

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { getNewDirection } from '../utils/functions';
import { UP, RIGHT, DOWN, LEFT } from '../utils/variables';

const WIDTH = 500;
const HEIGHT = 500;
const PIXELS_X = 10;
const PIXELS_Y = 10;
const PIXEL_WIDTH = WIDTH / PIXELS_X;
const PIXEL_HEIGHT = HEIGHT / PIXELS_Y;
const SCREEN_SIZE = PIXELS_X * PIXELS_Y;

const TICK = 300;
let SCORE = 0;

// startic vars
let DIRECTION = RIGHT;
let FOODPOSITION;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Canvas = styled.canvas`
  background-color: lightgoldenrodyellow;
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
  const newDirection = getNewDirection(key);
  DIRECTION = newDirection;
}

const getCenterSquare = () => ({
  x: Math.floor((PIXELS_X - 1) / 2) * PIXEL_WIDTH,
  y: Math.floor((PIXELS_Y - 1) / 2) * PIXEL_HEIGHT,
})

const getRandomPosition = () => ({
  x: (Math.floor(Math.random() * PIXELS_X) * PIXEL_WIDTH),
  y: (Math.floor(Math.random() * PIXELS_Y) * PIXEL_HEIGHT),
})

const checkTailIntersection = (block, tail) => (
  tail.findIndex(segment => segment.x === block.x && segment.y === block.y) !== -1);

const setFoodPosition = (snake) => {
  const newFoodPosition = getRandomPosition();
  const takenPositons = snake;
  if (FOODPOSITION) takenPositons.push(FOODPOSITION);
  console.log(snake.length);
  if (checkTailIntersection(newFoodPosition, takenPositons) && snake.length !== SCREEN_SIZE) return setFoodPosition(snake);
  return newFoodPosition;
}

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
    FOODPOSITION = setFoodPosition(snakeRef.current);
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

      const drawFood = () => {
        ctx.fillStyle = 'red';
        ctx.fillRect(FOODPOSITION.x, FOODPOSITION.y, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.strokeRect(FOODPOSITION.x, FOODPOSITION.y, PIXEL_WIDTH, PIXEL_HEIGHT);
      }

      const moveSnake = () => {
        const oldSnake = snakeRef.current;
        const newSnake = [];
        const oldSnakeHead = oldSnake[0];
        let newSnakeHead;
        switch (DIRECTION) {
          case LEFT:
            newSnakeHead = { ...oldSnakeHead, x: oldSnakeHead.x - PIXEL_WIDTH };
            break;
          case UP:
            newSnakeHead = { ...oldSnakeHead, y: oldSnakeHead.y - PIXEL_HEIGHT };
            break;
          case DOWN:
            newSnakeHead = { ...oldSnakeHead, y: oldSnakeHead.y + PIXEL_HEIGHT };
            break;
          default:
            newSnakeHead = { ...oldSnakeHead, x: oldSnakeHead.x + PIXEL_WIDTH };
        }
        newSnake.push(newSnakeHead)

        if (oldSnake.length > 1) for (let i = 1; i < oldSnake.length; i += 1) newSnake.push(oldSnake[(i - 1)]);

        const snakeEats = newSnakeHead.x === FOODPOSITION.x && newSnakeHead.y === FOODPOSITION.y;
        if (snakeEats) {
          console.log('snake eats');
          newSnake.push(oldSnake[oldSnake.length - 1]);
          FOODPOSITION = setFoodPosition(oldSnake);
          SCORE += 1;
        }
        updateSnake(newSnake);
      }

      // game tick
      const gameTick = () => {
        if (runningRef.current) {
          ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
          moveSnake();
          drawFood();
          drawSnake();
          setTimeout(gameTick , TICK);
        }
      };

      drawSnake();
      drawFood();

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
