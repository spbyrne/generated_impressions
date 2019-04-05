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
  let ctx = generateCanvas(container,aspectRatio);
  let colour = getColour();
  container.appendChild(getInfoCard(title));
})();

function generateCanvas(container,aspectRatio) {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext("2d");
  let windowAspectRatio = width / height;
  
  if (windowAspectRatio > aspectRatio) {
    canvas.height = height * .66;
    canvas.width = canvas.height * aspectRatio;
  } else {
    canvas.width = width * .88;
    canvas.height = canvas.width / aspectRatio;
  };

  container.appendChild(canvas);
  return ctx;
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

function getTitleTemplate() {
  let titleTemplates = [
    'The {{ adjective }} {{ noun }}',
    '{{ an_adjective }} {{ noun }}',
    '{{ adjective }} {{ nouns }}',
    '{{ nouns }} at {{ noun }}',
    'The {{ nouns }} of {{ place }}',
    '{{ adjective }} {{ nouns }} from {{ place }}',
    '{{ adjective }} {{ place }}',
    '{{ name }} from {{ place }}',
    '{{ adjective }} {{ name }}'
  ]
  let titleTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];;
  return titleTemplate;
}

function getColour() {
  let colour = {};
  colour.sky = 'blue'
  return colour;
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

function getInfoCard(title) {
  let infoCard = document.createElement("div");
  infoCard.setAttribute('class', 'info-card');
  infoCard.innerHTML = "<h3 class='info-card__title'>" + title + "</h3>";
  infoCard.innerHTML += "<p class='info-card__meta'><span class='info-card__artist'>Anna Bernard</span>, 2019</p>";
  infoCard.innerHTML += "<p class='info-card__meta'><span class='info-card__medium'>Javascript & HTML Canvas</span></p>";
  return infoCard;
}

function titleCase(str) {
  let blacklist = [
    'of',
    'a',
    'an',
    'at',
    'from'
  ];
  return str.toLowerCase().split(' ').map(function(word,index) {
    if ((blacklist.indexOf(word) !== -1) && (index > 0)) {
      return word;
    }
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}