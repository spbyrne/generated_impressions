let times = [
  'midnight',
  'night',
  'twilight',
  'day',
  'noon'
];

(function() {
  /* Set up environment */
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  let width = windowWidth;
  let height = windowHeight;

  /* Generate Variables */
  let time = generateTime();
  let horizon = generateRatio();
  let river = generateRiver();

  /* Generate Colours */
  let skyColour = randomColor({
    luminosity: 'bright',
    hue: 'blue'
  });
  let skyFadedColour = randomColor({
    luminosity: 'light',
    hue: skyColour
  });
  let landColour = randomColor({
    luminosity: 'bright',
    hue: 'green'
  });
  let landFadedColour = randomColor({
    luminosity: 'light',
    hue: landColour
  });
  let fogColour = randomColor({
    luminosity: 'light',
    hue: 'blue'
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
  var skyFill = ctx.createLinearGradient(0, 0, 0, height);
  my_gradient.addColorStop(0, skyColour);
  my_gradient.addColorStop(1, skyFadedColour);
  ctx.fillStyle = skyFill;
  ctx.fillRect(0, 0, width, height -(height * horizon));

  /* Draw Land */
  var landFill = ctx.createLinearGradient( 0, height, 0, 0);
  my_gradient.addColorStop(0, landColour);
  my_gradient.addColorStop(1, landFadedColour);
  ctx.fillStyle = landFill;
  ctx.fillRect(0, height -(height * horizon), width, height * horizon);

  /* Draw River */
  drawRiver(ctx,river,skyColour,horizon,width,height);
})();

function generateTree() {
  let tree = {};
  return tree;
};

function generateRatio() {
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

function generateRiver() {
  let river = {};
  river.vanishingPoint = randDecimal();
  river.leftEdge = randDecimal();
  river.rightEdge = randDecimal(river.leftEdge + 0.1);
  console.log('Left Edge: ' + river.leftEdge);
  console.log('Right Edge: ' + river.rightEdge);
  return river;
};

function drawRiver(ctx,river,riverColor,horizon,width,height) {
  let horizonY = height - (height * horizon);
  let sideOneLength = height * horizon;
  let sideTwoLength = sideOneLength + width;
  let sideThreeLength = sideTwoLength + sideOneLength;

  ctx.fillStyle = riverColor;
  ctx.beginPath();
  ctx.moveTo(width * river.vanishingPoint, horizonY);

  if (river.leftEdge * sideThreeLength < sideOneLength) {
    ctx.lineTo(0, horizonY + sideThreeLength * river.leftEdge);
  } else {
    if (river.leftEdge * sideThreeLength < sideTwoLength) {
      let sideOneEdgeDecimal = sideOneLength / sideThreeLength;
      let relativePosition = river.leftEdge - sideOneEdgeDecimal;
      ctx.lineTo(relativePosition * width, height);
    } else {
      let sideTwoEdgeDecimal = sideTwoLength / sideThreeLength;
      let relativePosition = river.leftEdge - sideTwoEdgeDecimal;
      ctx.lineTo(width, height - (sideOneLength * relativePosition));
    }
  }

  if (river.rightEdge * sideThreeLength < sideOneLength) {
    ctx.lineTo(0, horizonY + sideThreeLength * river.rightEdge);
  } else {
    if (river.leftEdge * sideThreeLength < sideOneLength) {
      ctx.lineTo(0, height);
    }
    if (river.rightEdge * sideThreeLength < sideTwoLength) {
      let sideOneEdgeDecimal = sideOneLength / sideThreeLength;
      let relativePosition = river.rightEdge - sideOneEdgeDecimal;
      ctx.lineTo(relativePosition * width, height);
    } else {
      if (river.leftEdge * sideThreeLength < sideTwoLength) {
        ctx.lineTo(width, height);
      }
      let sideTwoEdgeDecimal = sideTwoLength / sideThreeLength;
      let relativePosition = river.rightEdge - sideTwoEdgeDecimal;
      ctx.lineTo(width, height - (sideOneLength * relativePosition));
    }
  }

  ctx.lineTo(width * river.vanishingPoint, horizonY);
  ctx.closePath();
  ctx.fill();
};

function randInt(min, max) {
  let int;
  min = Math.ceil(min);
  max = Math.floor(max);
  int = Math.floor(Math.random() * (max - min + 1)) + min;
  return int;
};

function randDecimal(min) {
  let random;
  random = Math.random();
  console.log("Seed: " + random);
  if (min) {
    random = min + ((1 - min) * random);
  }
  return random;
};

function randBool() {
  return Math.random() >= 0.5;
};