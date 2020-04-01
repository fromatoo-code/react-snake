// inspired by https://www.html5canvastutorials.com/advanced/html5-canvas-snake-game/

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, Container, Controls, MobileControls, Score } from '../components/SharedComponents';
import { getNewDirection, checkNoReverse } from '../utils/functions';
import { UP, RIGHT, DOWN, LEFT, COLOURS } from '../utils/variables';
import { useGameBoard } from '../utils/hooks';

let SCORE = 0;

// startic vars
let DIRECTION = RIGHT;
let FOODPOSITION;

const Canvas = styled.canvas`
  background-color: ${COLOURS.background};
  outline: 3px solid gray;
  width: ${props => props.gridSideWithUnit};
  height: ${props => props.gridSideWithUnit};
  margin: auto;
`;

const getCenterSquare = (gridSize, gridItemSide) => ({
  x: Math.floor((gridSize - 1) / 2) * gridItemSide,
  y: Math.floor((gridSize - 1) / 2) * gridItemSide,
})

const getRandomPosition = (gridSize, gridItemSide) => ({
  x: (Math.floor(Math.random() * gridSize) * gridItemSide),
  y: (Math.floor(Math.random() * gridSize) * gridItemSide),
})

const checkTailIntersection = (block, tail, gridSize) => (
  tail.findIndex(segment => Math.round(segment.x, gridSize) === Math.round(block.x, gridSize) && Math.round(segment.y, gridSize) === Math.round(block.y, gridSize)) !== -1);

const setFoodPosition = (snake, gridSize, gridItemSide) => {
  const newFoodPosition = getRandomPosition(gridSize, gridItemSide);
  const takenPositons = snake;
  if (FOODPOSITION) takenPositons.push(FOODPOSITION);
  if (checkTailIntersection(newFoodPosition, takenPositons, gridSize)) return setFoodPosition(snake, gridSize, gridItemSide);
  return newFoodPosition;
}

const Snake = () => {
  const { gridSide, gridSideWithUnit, gridItemSide, gridSize, tick } = useGameBoard();
  const [gameCanvas, setCanvas] = useState(null);
  const [snake, updateSnake] = useState([getCenterSquare(gridSize, gridItemSide)]);
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

  // controls
  const handleKeys = (keyPress) => {
    const { key } = keyPress;
    const newDirection = getNewDirection(key);
    if (!checkNoReverse(newDirection, DIRECTION, snakeRef.current.slice(1).length)) DIRECTION = newDirection;
  }

  const loseGame = () => {
    changeGameRunning(false);
    changeGameLost(true);
  }

  const reset = () => {
    DIRECTION = RIGHT;
    SCORE = 0;
    let resetSnake = [getCenterSquare(gridSize, gridItemSide)];
    FOODPOSITION = setFoodPosition(resetSnake, gridSize, gridItemSide);
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
    FOODPOSITION = setFoodPosition(snakeRef.current, gridSize, gridItemSide);
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
        ctx.fillRect(snakePart.x, snakePart.y, gridItemSide, gridItemSide);
        ctx.strokeRect(snakePart.x, snakePart.y, gridItemSide, gridItemSide);
      }

      const drawSnake = () => {
        const { current } = snakeRef;
        for (let i = 0; i < current.length; i += 1) {
          drawSnakePart(current[i], i === 0);
        }
      }

      const drawFood = () => {
        ctx.fillStyle = COLOURS.food;
        ctx.fillRect(FOODPOSITION.x, FOODPOSITION.y, gridItemSide, gridItemSide);
        ctx.strokeRect(FOODPOSITION.x, FOODPOSITION.y, gridItemSide, gridItemSide);
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
            newSnakeHead = { ...oldSnakeHead, x: oldSnakeHead.x - gridItemSide };
            break;
          case UP:
            newSnakeHead = { ...oldSnakeHead, y: oldSnakeHead.y - gridItemSide };
            break;
          case DOWN:
            newSnakeHead = { ...oldSnakeHead, y: oldSnakeHead.y + gridItemSide };
            break;
          default:
            newSnakeHead = { ...oldSnakeHead, x: oldSnakeHead.x + gridItemSide };
        }
        newSnake.push(newSnakeHead)

        if (oldSnake.length > 1) for (let i = 1; i < oldSnake.length; i += 1) newSnake.push(oldSnake[(i - 1)]);

        const snakeEats = Math.round(newSnakeHead.x, gridSize) === Math.round(FOODPOSITION.x, gridSize)
          && Math.round(newSnakeHead.y, gridSize) === Math.round(FOODPOSITION.y, gridSize);
        if (snakeEats) {
          newSnake.push(oldSnake[oldSnake.length - 1]);
          if (newSnake.length !== gridSize * gridSize ) FOODPOSITION = setFoodPosition(oldSnake, gridSize, gridItemSide);
          SCORE += 1;
        }
        updateSnake(newSnake);
        const isOutOfBounds = () => (newSnakeHead.x >= gridSide
          || newSnakeHead.x < 0
          || newSnakeHead.y >= gridSide
          || newSnakeHead.y < 0);
        if (isOutOfBounds() || checkTailIntersection(newSnakeHead, newSnake.slice(1), gridSize)) loseGame();
      }

      // game tick
      const gameTick = () => {
        if (runningRef.current) {
          ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
          moveSnake();
          if (gameLostRef.current) drawLossBackGround();
          drawFood();
          drawSnake();
          if (snakeRef.current.length === gridSize * gridSize) drawVictoryGround();
          setTimeout(gameTick , tick);
        }
      };
      drawSnake();
      drawFood();

      if (gameRunning) setTimeout(gameTick, tick);
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
      <Canvas id="snakeCanvas" height={gridSideWithUnit} width={gridSideWithUnit} gridSideWithUnit={gridSideWithUnit} />
      <MobileControls mobileConroller={dir => DIRECTION = dir} />
    </Container>
  )
}

export default Snake;
