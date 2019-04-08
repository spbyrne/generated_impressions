let Sentencer = require('sentencer');
let seedrandom = require('seedrandom');
let ColorScheme = require('color-scheme');
let fakerator = require("fakerator/dist/locales/en-CA")();
let chroma = require("chroma-js");

Sentencer.configure({
  actions: {
    place: function() {
      return getPlace();
    },
    name: function() {
      return getName();
    },
    greeting: function() {
      return getGreeting();
    },
    preposition: function() {
      return getPreposition();
    },
    mod: function() {
      return getMod();
    }
  }
});

(function() {
  let titleTemplate = getTitleTemplate();
  let title = titleCase(Sentencer.make(titleTemplate));
  generatePainting(title);
})();

function enterTitle(current) {
  var title = prompt("Please enter a title.",current);
  if (title != null) {
    generatePainting(title);
  }
}

function generatePainting(title) {
  seedrandom(title, { global: true });

  /* Generate World Constants */
  let painting = {};
  painting.time = getTime();
  painting.aspectRatio = getAspectRatio();
  painting.colourScheme = getColourScheme(painting.time);
  painting.horizon = getRatio();
  console.log(painting.horizon);
  let colour = getColour(painting);

  /* Set Up Environment */
  let container = document.querySelector('.container');
  container.innerHTML = "";
  let canvas = generateCanvas(container,painting.aspectRatio);
  let ctx = canvas.getContext("2d");
  container.appendChild(getInfoCard(title));

  /* Draw Sky */
  var skyFill = getSkyFill(ctx,(1 - painting.horizon) * canvas.height,colour.sky);
  ctx.fillStyle = skyFill;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* Draw Land */
  let landHeight = canvas.height * painting.horizon;
  let landY = canvas.height - landHeight;
  var landFill = getLandFill(ctx,landY,landHeight,colour.land);
  ctx.fillStyle = landFill;
  ctx.fillRect(0, landY, canvas.width, landHeight);
};

function generateCanvas(container,aspectRatio) {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let canvas = document.createElement('canvas');
  let windowAspectRatio = width / height;
  
  if (windowAspectRatio > aspectRatio) {
    canvas.height = height * .66;
    canvas.width = canvas.height * aspectRatio;
  } else {
    canvas.width = width * .88;
    canvas.height = canvas.width / aspectRatio;
  };

  container.appendChild(canvas);
  return canvas;
};

function getTime() {
  let times = [
    'night',
    'twilight',
    'day'
  ];
  let time = times[Math.floor(Math.random() * times.length)];;
  return time;
}

function getAspectRatio() {
  let aspectRatio;
  let aspectRatios = [
    1.2, /* Purdy - 6/5 */
    1.33333333333, /* Old School TV - 4/3 */
    1.4, /* Photo - 7/5 */
    1.77777777778 /* 16/9 */
  ];
  if (randBool(30)) {
    aspectRatio = aspectRatios[Math.floor(Math.random() * (aspectRatios.length - 1))];
    aspectRatio = 1 / aspectRatio;
  } else {
    aspectRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
  }
  return aspectRatio;
}

function getColour(painting) {
  let colour = {};
  colour.sky = getSkyColour(painting);
  colour.land = getLandColour(painting,colour);
  return colour;
}

function getColourScheme(time) {
  let colourScheme;
  switch(randInt(1,2)) {
    case 1:
      colourScheme = 'mono';
      break;
    case 2:
      colourScheme = 'triad';
      break;
    default:
      colourScheme = 'mono';
  }
  return colourScheme;
}

function getSkyColour(painting) {
  let h = rotateHue(randBias(0,240,60,1),180); // Random hue between cyan and yellow, bias towards blue
  let s = randBias(0, 100, 60, 1);
  let l;
  if (painting.time == 'night') {
    l = randBias(0, 100, 25, 1);
  } else if (painting.time == 'twilight') {
    l = randBias(0, 100, 35, 1);
  } else {
    l = randBias(0, 100, 60, 1);
  }
  return [h,s,l];
}

function getSkyFill(ctx,height,skyColour) {
  let fill = ctx.createLinearGradient(0, 0, 0, height);
  let horizonH = rotateHue(skyColour[0],randInt(0,30));
  let horizonS = skyColour[1];
  let horizonL = randBias(skyColour[2] - 10, skyColour[2] + 40, skyColour[2] + 10, 1);
  fill.addColorStop(0, hsl(skyColour));
  fill.addColorStop(1, hsl([horizonH,horizonS,horizonL]))
  return fill;
}

function getLandColour(painting,colour) {
  let skyH = colour.sky[0];
  let skyS = colour.sky[1];
  let skyL = colour.sky[2];
  let h;
  if (painting.colourScheme == 'mono') {
    h = randBias(skyH  - 30, skyH + 30, skyH,1);
  } else if ((painting.colourScheme == 'triad')) {
    h = rotateHue(skyH,randBias(105,135,120,1));
  }
  let s = randBias(skyS  - 15, skyS + 15, skyS,1);
  let l;
  if (painting.time == 'night') {
    l = randBias(5, 30, 18,1);
  } else if (painting.time == 'twilight') {
    l = randBias(10, 50, 20, 1);
  } else {
    l = randBias(10,70,25,1);
  }
  return [h,s,l];
}

function getLandFill(ctx,startX,height,landColour) {
  let fill = ctx.createLinearGradient(0, startX, 0, startX + height);
  let horizonH = rotateHue(landColour[0],randInt(0,30));
  let horizonS = landColour[1] * .6;
  let horizonL = randBias(landColour[1] - 5,landColour[1] + 10, landColour[1] + 7, 1);
  fill.addColorStop(0, hsl([horizonH,horizonS,horizonL]))
  fill.addColorStop(1, hsl(landColour));
  return fill;
}

function rotateHue(hue,rotation) {
  let rotatedHue;
  rotatedHue = hue - rotation;
  if (rotatedHue < 0) {
    rotatedHue = 360 + rotatedHue;
  }
  return rotatedHue;
}

function hsl(array) {
  let h = array[0];
  let s = array[1];
  let l = array[2];
  return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function getRatio() {
  let ratio = 1;
  let goldenRatio = 1.6180339887498948482045868;
  let exponent = randBias(1,4,2,1);
  let inverse = randBool(30);
  for (let i = 0; i < exponent; i++) {
    ratio = ratio / goldenRatio;
  }
  if (inverse) {
    ratio = 1 - ratio;
  }
  return ratio;
};

function randBias(min, max, bias, influence = 1) {
  var rnd = Math.random() * (max - min) + min,
      mix = Math.random() * influence;
  return rnd * (1 - mix) + bias * mix;
}

function randInt(min, max) {
  let int;
  min = Math.ceil(min);
  max = Math.floor(max);
  int = Math.floor(Math.random() * (max - min + 1)) + min;
  return int;
}

function randDecimal(min) {
  let random;
  random = Math.random();
  console.log("Seed: " + random);
  if (min) {
    random = min + ((1 - min) * random);
  }
  return random;
}

function randBool(odds) {
  let bool;
  if (odds == undefined) {
    bool = Math.random() >= 0.5;
  } else {
    bool = Math.random() <= (odds / 100);
  }
  return bool;
}

function getTitleTemplate() {
  let titleTemplates = [
    'The {{ adjective }} {{ noun }}',
    'The {{ mod }} {{ noun }} of {{ noun }}',
    'The {{ mod }} {{ nouns }} {{ preposition }} {{ name }}',
    'The {{ nouns }} of {{ place }}',
    '{{ greeting }} to {{ place }}',
    '{{ an_adjective }} {{ noun }}',
    '{{ noun }} {{ preposition }} {{ nouns }}',
    '{{ adjective }} {{ nouns }}',
    '{{ nouns }} {{ preposition }} {{ place }}',
    '{{ greeting }} {{ preposition }} {{ place }}',
    '{{ greeting }} {{ preposition }} {{ noun }}',
    '{{ adjective }} {{ nouns }} {{ preposition }} {{ place }}',
    '{{ adjective }} {{ place }}',
    '{{ mod }} {{ name }} {{ preposition }} {{ place }}',
    '{{ mod }} {{ name }} {{ preposition }} {{ nouns }}',
    '{{ adjective }} {{ mod }} {{ name }}'
  ]
  let titleTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];;
  return titleTemplate;
}

function getPlace() {
  let option = randInt(1,3);
  let place;
  switch(option) {
    case 1:
      place = fakerator.address.country();
      break;
    case 2:
      place = fakerator.address.city();
      break;
    default:
      place = fakerator.address.streetName();
  }
  return place;
}

function getName() {
  let option = randInt(1,3);
  let name;
  switch(option) {
    case 1:
      name = fakerator.names.firstName()
      break;
    case 2:
      name = fakerator.names.lastName()
      break;
    default:
      name = fakerator.names.firstName() + ' ' + fakerator.names.lastName();
  }
  return name;
}

function getGreeting() {
  let greetings = [
    'farewell',
    'welcome',
    'lament'
  ];
  let greeting;
  greeting = greetings[Math.floor(Math.random() * greetings.length)];;
  return greeting;
}

function getPreposition() {
  let prepositions = [ "above", "absent", "across", "after", "against", "along", "around", "as", "aside", "astride", "at", "atop", "barring", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "by", "despite", "down", "during", "failing", "following", "for", "from", "given", "in", "inside", "into", "like", "midst", "near", "of", "off", "on", "onto", "opposite", "outside", "over", "past", "round", "since", "than", "through", "throughout", "till", "times", "to", "toward", "towards", "under", "underneath", "unlike", "until", "unto", "up", "upon", "versus", "with", "within", "without" ];
  let preposition;
  preposition = prepositions[Math.floor(Math.random() * prepositions.length)];;
  return preposition;
}

function getMod() {
  let mods = ['young','good','old','bad','late','poor','small','big','royal','ambitious','courageous','petulant','obtuse'];
  let mod = " ";
  if (randBool()) {
    mod = mods[Math.floor(Math.random() * mods.length)];
  }
  return mod;
};

function getInfoCard(title) {
  let infoCard = document.createElement("div");
  infoCard.setAttribute('class', 'info-card');
  infoCard.innerHTML = "<h3 class='info-card__title'>" + title + "</h3>";
  infoCard.innerHTML += "<p class='info-card__meta'><span class='info-card__artist'>Anna Bernard</span>, 2019</p>";
  infoCard.innerHTML += "<p class='info-card__meta'><span class='info-card__medium'>Javascript & HTML Canvas</span></p>";
  infoCard.addEventListener("click", function(){
    enterTitle(title);
  });
  return infoCard;
}

function titleCase(str) {
  let blacklist = [ 'of', 'a', 'an', 'at', 'from', 'on', 'to', 'up', 'by', 'in', 'so' ];
  let string = str.replace(/ {1,}/g," ");
  return string.toLowerCase().split(' ').map(function(word,index) {
    if ((blacklist.indexOf(word) !== -1) && (index > 0)) {
      return word;
    } else if (typeof word[0] !== 'undefined') {
      return word.replace(word[0], word[0].toUpperCase());
    } else {
      console.log('!' + word);
      return word;
    }
  }).join(' ');
}