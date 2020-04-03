// conrols
export const RIGHT = 'right';
export const LEFT = 'left';
export const UP = 'up';
export const DOWN = 'down';

export const ANIMALS = 'animals';
export const FOOD = 'food';
export const PEOPLE = 'people';

export const LINE = 'line';
export const ROUND = 'round';
export const SQUARE = 'square';

// storageKeys
export const LOCAL_SPEED = 'speed';
export const LOCAL_GRID = 'grid';
export const LOCAL_HEAD_COLOR = 'localhead';
export const LOCAL_TAIL_COLOR = 'localtail';
export const LOCAL_PRAY = 'localpray';
export const LOCAL_SNAKE_SHAPE = 'socalsnakeshape';
export const DEFAULT_SPEED = '3';
export const DEFAULT_GRID = '10';
export const DEFAULT_PRAY = ANIMALS;
export const DEFAULT_SNAKE_SHAPE = LINE;

// colors
export const COLOURS = {
  background: 'lightgoldenrodyellow',
  backgroundLoss: 'yellow',
  backgroundVictory: 'green',
  food: 'red',
  snakeHead: 'darkcyan',
  snakeTail: 'lightseagreen',
};

export const animals = [
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

export const food = [
  '🍏',
  '🍎',
  '🍐',
  '🍊',
  '🍋',
  '🍌',
  '🍉',
  '🍇',
  '🍒',
  '🍓',
  '🍑',
  '🍍',
  '🥥',
  '🥝',
  '🍅',
  '🥑',
  '🥦',
  '🥒',
  '🌽',
  '🥕',
  '🥔',
  '🥐',
  '🥨',
  '🧀',
  '🥚',
  '🥞',
  '🥓',
  '🥩',
  '🍗',
  '🍖',
  '🌭',
  '🍔',
  '🥓',
  '🍟',
  '🍕',
  '🌮',
  '🥪',
  '🥗',
  '🍧',
  '🍨',
  '🍦',
  '🥧',
  '🍰',
  '🍭',
  '🍬',
  '🍫',
  '☕️',
  '🍵',
  '🍺',
  '🌰',
  '🍷',
  '🥛',
  '🥃',
  '🍸',
  '🍹',
];

export const people = [
  '😀',
  '😁',
  '😂',
  '🤣',
  '😃',
  '😄',
  '😅',
  '😆',
  '😉',
  '😊',
  '😋',
  '😎',
  '😍',
  '😘',
  '😗',
  '😙',
  '😚',
  '🙂',
  '🤗',
  '🤩',
  '🤔',
  '🤨',
  '😐',
  '😑',
  '😶',
  '🙄',
  '😏',
  '😣',
  '😥',
  '😮',
  '🤐',
  '😯',
  '😪',
  '😫',
  '😴',
  '😌',
  '😛',
  '😜',
  '😝',
  '🤤',
  '😒',
  '😓',
  '😔',
  '😕',
  '🙃',
  '🤑',
  '😲',
  '☹️',
  '🙁',
  '😖',
  '😞',
  '😟',
  '😤',
  '😢',
  '😭',
  '😦',
  '😧',
  '😨',
  '😩',
  '🤯',
  '😬',
  '😰',
  '😱',
  '😳',
  '🤪',
  '😵',
];

export const preyable = {
  animals,
  food,
  people
}
