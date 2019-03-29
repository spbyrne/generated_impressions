let times = [
  'midnight',
  'night',
  'twilight',
  'day',
  'noon'
];

(function() {
  /* Set up environment */
  let width = 1000;
  let height = 800;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  /* Generate random stuff */
  let time = generateTime();
  let horizon = generateHorizon();
  let skyColour = randomColor({
    luminosity: 'light',
    hue: 'blue'
  });
  let landColour = randomColor({
    luminosity: 'light',
    hue: 'green'
  });
  
  /* Create canvas and add to body */
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext("2d");
  var body = document.getElementsByTagName("body")[0];
  canvas.id = "CursorLayer";
  canvas.width = width;
  canvas.height = height;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid black";
  canvas.style.left = (windowWidth / 2) - (width / 2) + 'px';
  canvas.style.top = (windowHeight / 2) - (height / 2) + 'px';
  body.appendChild(canvas);

  /* Draw Stuff */

  /* Draw Sky */
  ctx.fillStyle = skyColour;
  ctx.fillRect(0, 0, width, height -(height * horizon));

  /* Draw Land */
  ctx.fillStyle = landColour;
  ctx.fillRect(0, height -(height * horizon), width, height * horizon);
})();

function generateTree() {
  let tree = {};
  return tree;
};

function generateHorizon() {
  let horizon;
  let fraction = 2 / 3;
  let exponent = randInt(1,4);
  horizon = Math.pow(fraction,exponent);
  horizon = randBool() ? 1 - horizon : horizon;
  return horizon;
};

function generateTime() {
  let time;
  time = randInt(1, times.length) - 1;
  return time;
};

function randInt(min, max) {
  let int;
  min = Math.ceil(min);
  max = Math.floor(max);
  int = Math.floor(Math.random() * (max - min + 1)) + min;
  return int;
};

function randBool() {
  return Math.random() >= 0.5;
};