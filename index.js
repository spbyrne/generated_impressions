(function() {
  let horizon = generateHorizon();

  console.log(horizon);
})();

function generateHorizon() {
  let fraction = 2 / 3;
  let exponent = randInt(1,4);
  let result = Math.pow(fraction,exponent);
  return result;
};

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function randBool() {
  return Math.random() >= 0.5;
};