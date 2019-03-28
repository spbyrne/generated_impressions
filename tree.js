let times = [
  'midnight',
  'night',
  'twilight',
  'day',
  'noon'
];

(function() {
  let tree = generateTree();
  let time = generateTime();
  let horizon = 1 / 3;
  console.log('Time: ' + times[time]);
})();

function generateTree() {
  let tree = {};
  return tree;
};

function generateTime() {
  let time = randInt(1, times.length) - 1;
  return time;
};

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function randBool() {
  return Math.random() >= 0.5;
};