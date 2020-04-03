import snakeFireworks from '../images/snake-fireworks.jpg';

import { addToLocalStorage, loadFromLocalStorage } from '../utils/storageUtils';
import {
  LOCAL_GRID,
  DEFAULT_GRID,
  LOCAL_SPEED,
  DEFAULT_SPEED,
  LOOCAL_USERNAME,
  LOOCAL_BEST,
 } from '../utils/variables';

export const getBackgroundImage = () => {
  return snakeFireworks;
};

export const setHightScore = (score) => {
  const user = loadFromLocalStorage(LOOCAL_USERNAME);
  if (user) {
    const grid = loadFromLocalStorage(LOCAL_GRID, DEFAULT_GRID);
    const speed = loadFromLocalStorage(LOCAL_SPEED, DEFAULT_SPEED);
    const key = `${LOOCAL_BEST}${grid}`;
    const relevantResults = loadFromLocalStorage(key, []);
    const newResults = relevantResults;
    const newResult = { name: user, score, speed };
    let addedResult = false
    for (let i = 0; i < relevantResults.length; i +=1) {
      if (relevantResults[i].score < score || (relevantResults[i].score === score && relevantResults[i].speed < speed)) {
        newResults.splice(i, 0, newResult);
        addedResult = true;
        break;
      }
    }

    if (!addedResult) newResults.push(newResult);

    const finalizedResults = newResults.slice(0, 10);

    addToLocalStorage(finalizedResults, key);
  };
};
