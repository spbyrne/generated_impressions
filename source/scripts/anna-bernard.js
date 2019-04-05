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
  /* Generate Seed/Title */
  let titleTemplate = getTitleTemplate();
  let title = titleCase(Sentencer.make(titleTemplate));
  seedrandom(title, { global: true });
  console.log(title);

  /* Generate World Constants */
  let time = getTime();
  let aspectRatio = getAspectRatio();

  /* Set Up Environment */
  let container = document.querySelector('.container');
  let canvas = generateCanvas(container,aspectRatio);
  let ctx = canvas.getContext("2d");
  let colour = getColour();
  container.appendChild(getInfoCard(title));

  /* Draw Sky */
  ctx.fillStyle = colour.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
})();

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

function getColour() {
  let colour = {};
  colour.sky = getSkyColour();
  return colour;
};

function getSkyColour() {
  let skyH = rotateHue(randBias(0,240,60,1),180); // Random hue between cyan and yellow, bias towards blue
  let skyS = randBias(0, 100, 60, 1);
  let skyL = randBias(0, 100, 75, 1);
  return hsl(skyH,skyS,skyL);
}

function rotateHue(hue,rotation) {
  let rotatedHue;
  rotatedHue = hue - rotation;
  if (rotatedHue < 0) {
    rotatedHue = 360 + rotatedHue;
  }
  return rotatedHue;
};

function hsl(h,s,l) {
  h = typeof h !== 'undefined' ? h : randInt(1, 360);
  s = typeof s !== 'undefined' ? s : randBias(0, 100, 70, 1);
  l = typeof l !== 'undefined' ? l : randBias(0, 100, 50, 1);
  return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

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
  let prepositions = [ "above", "absent", "across", "after", "against", "along", "around", "as", "aside", "astride", "at", "atop", "barring", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "despite", "down", "during", "failing", "following", "for", "from", "given", "in", "inside", "into", "like", "midst", "near", "of", "off", "on", "onto", "opposite", "out", "outside", "over", "past", "round", "since", "than", "through", "throughout", "till", "times", "to", "toward", "towards", "under", "underneath", "unlike", "until", "unto", "up", "upon", "versus", "with", "within", "without" ];
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
  return infoCard;
}

function titleCase(str) {
  let blacklist = [ 'of', 'a', 'an', 'at', 'from', 'on', 'to', 'up', 'by', 'in', 'so' ];
  str = str.replace(/\s\s+/g, ' ');
  return str.toLowerCase().split(' ').map(function(word,index) {
    if ((blacklist.indexOf(word) !== -1) && (index > 0)) {
      return word;
    }
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}