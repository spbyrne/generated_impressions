let times = [
  'midnight',
  'night',
  'twilight',
  'day',
  'noon'
];

let aspectRatios = [
  1.2, /* Purdy - 6/5 */
  1.33333333333, /* Old School TV - 4/3 */
  1.4, /* Photo - 7/5 */
  1.77777777778 /* 16/9 */
];

(function() {
  /* Set up environment */
  let body = document.getElementsByTagName("body")[0];
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let landscape = randBool(true);
  let ctx = generateCanvas(body,landscape,windowWidth,windowHeight);

  /* Generate Variables */
  let time = generateTime();
  let horizon = generateRatio();
  let river = generateRiver();
  let fogDensity = randDecimal();


  /* Generate Colours */
  let skyColour = randomColor({
    luminosity: 'bright',
    format: 'rgba',
    alpha: 1,
    hue: 'blue'
  });
  let skyFadedColour = randomColor({
    luminosity: 'light',
    format: 'rgba',
    alpha: 1,
    hue: skyColour
  });
  var skyFill = ctx.createLinearGradient(0, 0, 0, height);
  skyFill.addColorStop(0, skyColour);
  skyFill.addColorStop(1, skyFadedColour);

  let landColour = randomColor({
    luminosity: 'bright',
    format: 'rgba',
    alpha: 1,
    hue: 'green'
  });
  let landFadedColour = randomColor({
    luminosity: 'light',
    format: 'rgba',
    alpha: 1,
    hue: landColour
  });
  var landFill = ctx.createLinearGradient( 0, height, 0, 0);
  landFill.addColorStop(0, landColour);
  landFill.addColorStop(1, landFadedColour);

  let fogColour = randomColor({
    luminosity: 'light',
    format: 'rgba',
    alpha: fogDensity,
    hue: 'blue'
  });
  var fogFill = ctx.createLinearGradient(0, 0, 0, height);
  fogFill.addColorStop(0, 'rgba(255,255,255,0)');
  fogFill.addColorStop((1 - horizon), fogColour);
  fogFill.addColorStop(1, 'rgba(255,255,255,0)');  

  /* Draw Stuff */

  /* Draw Sky */
  ctx.fillStyle = skyFill;
  ctx.fillRect(0, 0, width, height -(height * horizon));

  /* Draw Land */
  ctx.fillStyle = landFill;
  ctx.fillRect(0, height -(height * horizon), width, height * horizon);

  /* Draw River */
  drawRiver(ctx,river,skyColour,horizon,width,height);

  ctx.fillStyle = fogFill;
  ctx.fillRect(0, 0, width, height);
})();

function generateCanvas(container) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.left = (windowWidth / 2) - (width / 2) + 'px';
  canvas.style.top = (windowHeight / 2) - (height / 2) + 'px';
  container.appendChild(canvas);
  return ctx;
};

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

function randInt(min, max, bias) {
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

function randBool(bias) {
  let bool;
  if (bias == undefined) {
    bool = Math.random() >= 0.5;
  } else {
    if (bias) {
      bool = Math.random() >= 0.35;
    } else {
      bool = Math.random() >= 0.65;
    }
  }
  return bool;
};