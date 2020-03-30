// inspired by https://www.html5canvastutorials.com/advanced/html5-canvas-snake-game/

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, Container, Controls, Score } from './SharedComponents';
import { getNewDirection } from '../utils/functions';
import { UP, RIGHT, DOWN, LEFT, COLOURS } from '../utils/variables';

const WIDTH = 500;
const HEIGHT = 500;
const PIXELS_X = 10;
const PIXELS_Y = 10;
const PIXEL_WIDTH = WIDTH / PIXELS_X;
const PIXEL_HEIGHT = HEIGHT / PIXELS_Y;
const SCREEN_SIzE = PIXELS_X * PIXELS_Y;

const TICK = 250;
let SCORE = 0;

// startic vars
let DIRECTION = RIGHT;
let FOODPOSITION;

const Canvas = styled.canvas`
  background-color: ${COLOURS.background};
  outline: 3px solid gray;
  width: ${WIDTH};
  height: ${HEIGHT};
  margin: auto;
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
  if (checkTailIntersection(newFoodPosition, takenPositons)) return setFoodPosition(snake);
  return newFoodPosition;
}

const Snake = () => {
  const [gameCanvas, setCanvas] = useState(null);
  const [snake, updateSnake] = useState([getCenterSquare()]);
  const [gameRunning, changeGameRunning] = useState(false);
  const [gameLost, changeGameLost] = useState(false);
  const runningRef = useRef(gameRunning);
  runningRef.current = gameRunning;
  const scoreRef = useRef(SCORE);
  scoreRef.current = SCORE;
  const snakeRef = useRef(snake);
  // there is some strange bug, where a random position is added to the snake in the beginning of the game
  snakeRef.current = scoreRef.current === 0 ? [snake[0]] : snake;
  const gameLostRef = useRef(gameLost);
  gameLostRef.current = gameLost;

  const loseGame = () => {
    changeGameRunning(false);
    changeGameLost(true);
  }

  const reset = () => {
    DIRECTION = RIGHT;
    SCORE = 0;
    let resetSnake = [getCenterSquare()];
    FOODPOSITION = setFoodPosition(resetSnake);
    if (gameCanvas) {
      const ctx = gameCanvas.getContext("2d");
      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    }
    updateSnake([resetSnake[0]]);
    changeGameLost(false);
  }

  useEffect(() => {
    // get canvas
    setCanvas(document.getElementById("snakeCanvas"));
    // add controls listener
    window.addEventListener('keydown', handleKeys, { passive: false });
    FOODPOSITION = setFoodPosition(snakeRef.current);
    return () => {
      window.removeEventListener('keydown', handleKeys);
      runningRef.current = false;
      reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameCanvas) {
      // Return a two dimensional drawing context
      const ctx = gameCanvas.getContext("2d");
      //  Select the colour for the border of the canvas
      ctx.strokestyle="brown";
      // Draw a "border" around the entire canvas
      ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

      const drawSnakePart = (snakePart, isHead) => {
        ctx.fillStyle = isHead ? COLOURS.snakeHead : COLOURS.snakeTail;
        ctx.fillRect(snakePart.x, snakePart.y, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.strokeRect(snakePart.x, snakePart.y, PIXEL_WIDTH, PIXEL_HEIGHT);
      }

      const drawSnake = () => {
        const { current } = snakeRef;
        for (let i = 0; i < current.length; i += 1) {
          drawSnakePart(current[i], i === 0);
        }
      }

      const drawFood = () => {
        ctx.fillStyle = COLOURS.food;
        ctx.fillRect(FOODPOSITION.x, FOODPOSITION.y, PIXEL_WIDTH, PIXEL_HEIGHT);
        ctx.strokeRect(FOODPOSITION.x, FOODPOSITION.y, PIXEL_WIDTH, PIXEL_HEIGHT);
      }

      const drawLossBackGround = () => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      }

      const drawVictoryGround = () => {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
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
          newSnake.push(oldSnake[oldSnake.length - 1]);
          if (newSnake.length !== SCREEN_SIzE ) FOODPOSITION = setFoodPosition(oldSnake);
          SCORE += 1;
        }
        updateSnake(newSnake);
        const isOutOfBounds = () => (newSnakeHead.x >= WIDTH
          || newSnakeHead.x < 0
          || newSnakeHead.y >= HEIGHT
          || newSnakeHead.y < 0);
        if (isOutOfBounds() || checkTailIntersection(newSnakeHead, newSnake.slice(1))) loseGame();
      }

      // game tick
      const gameTick = () => {
        if (runningRef.current) {
          ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
          moveSnake();
          if (gameLostRef.current) drawLossBackGround();
          drawFood();
          drawSnake();
          if (snakeRef.current.length === SCREEN_SIzE) drawVictoryGround();
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
    if (gameLostRef.current) reset();
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
