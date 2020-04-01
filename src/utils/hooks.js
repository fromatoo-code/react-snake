import { useMediaQuery } from 'react-responsive'

import { LOCAL_SPEED, LOCAL_GRID } from '../utils/variables';
import { loadFromLocalStorage } from '../utils/storageUtils';

const MOBILE_WIDTH = '768px';

export const useGameBoard = () => {
  const isMobile = useMediaQuery({ query: `(max-width: ${MOBILE_WIDTH})`});
  const DESKTOP_SIDE = 500;
  const MOBILE_SIDE = 90;
  const GRID_SIDE =  isMobile ? MOBILE_SIDE : DESKTOP_SIDE;
  const GRID_SIDE_WITH_UNIT = `${GRID_SIDE}${isMobile ? 'vw' : 'px'}`;

  const GRID_SIZE =  loadFromLocalStorage(LOCAL_GRID, 10);
  const GRID_ITEM_SIDE = GRID_SIDE / GRID_SIZE;
  const GRID_ITEM_SIDE_WITH_UNIT = `${GRID_ITEM_SIDE}${isMobile ? 'vw' : 'px'}`;

  const BASETICK = 1000;
  const SPEED = loadFromLocalStorage(LOCAL_SPEED,3);
  const TICK = BASETICK / SPEED;
  return {
    gridSide: GRID_SIDE,
    gridSideWithUnit: GRID_SIDE_WITH_UNIT,
    gridItemSide: GRID_ITEM_SIDE,
    gridItemSideWithUnit: GRID_ITEM_SIDE_WITH_UNIT,
    gridSize: GRID_SIZE,
    tick: TICK,
  };
}
