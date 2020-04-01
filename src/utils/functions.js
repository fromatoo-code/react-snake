import { UP, RIGHT, DOWN, LEFT } from './variables';

export const getNewDirection = (key) => {
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
  return newDirection;
};

export const checkNoReverse = (newDir, oldDir, length) => {
  if (length === 0) return false;
  if ((newDir === LEFT && oldDir === RIGHT)
    || (newDir === RIGHT && oldDir === LEFT)
    || (newDir === UP && oldDir === DOWN)
    || (newDir === DOWN && oldDir === UP)) return true
}
