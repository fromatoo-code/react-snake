// inspired by https://www.html5canvastutorials.com/advanced/html5-canvas-snake-game/

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Container, Header, MobileControls } from '../components/SharedComponents';
import { getNewDirection, checkNoReverse } from '../utils/functions';
import {
  UP,
  RIGHT,
  DOWN,
  LEFT,
  COLOURS,
  LOCAL_HEAD_COLOR,
  LOCAL_TAIL_COLOR,
  preyable,
  LOCAL_PRAY,
  DEFAULT_PRAY,
  LOCAL_SNAKE_SHAPE,
  DEFAULT_SNAKE_SHAPE,
  ROUND,
  SQUARE,
 } from '../utils/variables';
import { useGameBoard } from '../utils/hooks';
import { loadFromLocalStorage } from '../utils/storageUtils';
import { getBackgroundImage, setHightScore } from '../utils/gettersAndSetters';

const getAnimal = () => {
  const pray = preyable[loadFromLocalStorage(LOCAL_PRAY, DEFAULT_PRAY)];
  return pray[Math.floor(Math.random() * (pray.length - 1))]
};

let SCORE = 0;
let PRAY = getAnimal();

// startic vars
let DIRECTION = RIGHT;
let FOODPOSITION;

const Canvas = styled.canvas`
  background-color: ${COLOURS.background};
  ${props => props.gamewon && `background-image: url(${getBackgroundImage()});`}
  background-size: contain;
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
  const [gameWon, changeGameWon] = useState(false);
  const runningRef = useRef(gameRunning);
  runningRef.current = gameRunning;
  const scoreRef = useRef(SCORE);
  scoreRef.current = SCORE;
  const snakeRef = useRef(snake);
  // there is some strange bug, where a random position is added to the snake in the beginning of the game
  snakeRef.current = scoreRef.current === 0 ? [snake[0]] : snake;
  const gameLostRef = useRef(gameLost);
  gameLostRef.current = gameLost;
  const gameWonRef = useRef(gameWon);
  gameWonRef.current = gameWon;

  // controls
  const handleKeys = (keyPress) => {
    const { key } = keyPress;
    const newDirection = getNewDirection(key);
    if (!checkNoReverse(newDirection, DIRECTION, snakeRef.current.slice(1).length)) DIRECTION = newDirection;
  }

  const loseGame = () => {
    changeGameRunning(false);
    changeGameLost(true);
    setHightScore(scoreRef.current);
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
    changeGameWon(false);
  }

  useEffect(() => {
    // get canvas
    setCanvas(document.getElementById("snakeCanvas"));
    // add controls listener
    window.addEventListener('keydown', handleKeys, { passive: false });
    FOODPOSITION = setFoodPosition(snakeRef.current, gridSize, gridItemSide);
    PRAY = getAnimal();
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

      const getDirection = (snakepart, halfSide) => {
        let headRectangle;
        switch (DIRECTION) {
          case UP:
            headRectangle = ctx.fillRect(snakepart.x, snakepart.y + halfSide, gridItemSide, halfSide);
            break;
          case LEFT:
            headRectangle = ctx.fillRect(snakepart.x + halfSide, snakepart.y, halfSide, gridItemSide);
            break;
          case DOWN:
            headRectangle = ctx.fillRect(snakepart.x, snakepart.y, gridItemSide, halfSide);
            break;
          default:
            headRectangle = ctx.fillRect(snakepart.x, snakepart.y, halfSide, gridItemSide);
        }
        return headRectangle;
      }

      const drawSnakePart = (snakePart, isHead) => {
        const round = loadFromLocalStorage(LOCAL_SNAKE_SHAPE, DEFAULT_SNAKE_SHAPE) === ROUND;
        const square = loadFromLocalStorage(LOCAL_SNAKE_SHAPE, DEFAULT_SNAKE_SHAPE) === SQUARE;
        ctx.fillStyle = isHead
          ? loadFromLocalStorage(LOCAL_HEAD_COLOR, COLOURS.snakeHead)
          : loadFromLocalStorage(LOCAL_TAIL_COLOR, COLOURS.snakeTail);
        if (isHead || round) {
          if (square) {
            ctx.fillRect(snakePart.x, snakePart.y, gridItemSide, gridItemSide);
            ctx.strokeRect(snakePart.x, snakePart.y, gridItemSide, gridItemSide)
          } else {
            const halfSide = gridItemSide / 2;
            ctx.beginPath();
            ctx.arc(snakePart.x + halfSide, snakePart.y + halfSide, halfSide, 0, 2 * Math.PI);
            ctx.fill();
            if (snakeRef.current.length > 1 && !round) {
              getDirection(snakePart, halfSide);
            }
          }
        } else {
          ctx.fillRect(snakePart.x, snakePart.y, gridItemSide, gridItemSide);
          if (square) ctx.strokeRect(snakePart.x, snakePart.y, gridItemSide, gridItemSide);
        }
      }

      const drawSnake = () => {
        const { current } = snakeRef;
        for (let i = 0; i < current.length; i += 1) {
          drawSnakePart(current[i], i === 0);
        }
      }

      const drawFood = () => {
        ctx.fillStyle = COLOURS.food;
        ctx.font = `${gridItemSide * 0.7}px Arial`;
        ctx.fillText(PRAY, FOODPOSITION.x, FOODPOSITION.y + (gridItemSide * 0.8));
      }

      const drawLossBackGround = () => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      }

      const drawVictoryGround = () => {
        changeGameRunning(false);
        changeGameWon(true);
        setHightScore(scoreRef.current);
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
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
          PRAY = getAnimal();
          if (newSnake.length !== gridSize * gridSize ) FOODPOSITION = setFoodPosition(oldSnake, gridSize, gridItemSide);
          SCORE += 1;
        }
        updateSnake(newSnake);
        const isOutOfBounds = () => (Math.round(newSnakeHead.x, gridSize) >= gridSide
          || Math.round(newSnakeHead.x, gridSize) < 0
          || Math.round(newSnakeHead.y, gridSize) >= gridSide
          || Math.round(newSnakeHead.y, gridSize) < 0);
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
          if (!gameLostRef.current && !gameWonRef.current) setTimeout(gameTick , tick);
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
    if (gameLostRef.current || gameWon) reset();
    changeGameRunning(!gameRunning);
  };

  return (
    <Container>
      <Header handleClick={handleClick} gameRunning={gameRunning} score={scoreRef.current} />
      <Canvas id="snakeCanvas" height={gridSideWithUnit} width={gridSideWithUnit} gridSideWithUnit={gridSideWithUnit} gamewon={gameWon} />
      <MobileControls mobileConroller={dir => DIRECTION = dir} />
    </Container>
  )
}

export default Snake;
