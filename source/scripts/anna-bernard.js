let Sentencer = require('sentencer');
let seedrandom = require('seedrandom');
let ColorScheme = require('color-scheme');
let fakerator = require("fakerator/dist/locales/fr-FR")();

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
  console.log(time);

  let aspectRatio = getAspectRatio();
  console.log(aspectRatio);

  /* Set Up Environment */
  let body = document.getElementsByTagName("body")[0];
  let width = window.innerWidth;
  let height = window.innerHeight;
  let landscape = randBool(true);
  let ctx = generateCanvas(body,landscape,width,height);
})();

function generateCanvas(container,landscape,width,height) {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.left = (width / 2) - (width / 2) + 'px';
  canvas.style.top = (height / 2) - (height / 2) + 'px';
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
  let aspectRatios = [
    1.2, /* Purdy - 6/5 */
    1.33333333333, /* Old School TV - 4/3 */
    1.4, /* Photo - 7/5 */
    1.77777777778 /* 16/9 */
  ];
  let aspectRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];;
  return aspectRatio;
}

function getTitleTemplate() {
  let titleTemplates = [
    'The {{ adjective }} {{ noun }}',
    '{{ an_adjective }} {{ noun }}',
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

function randInt(min, max, bias) {
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
}

function getPlace() {
  let place = fakerator.address.city();
  return place;
}

function getName() {
  let name = fakerator.names.name();
  return name;
}

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}