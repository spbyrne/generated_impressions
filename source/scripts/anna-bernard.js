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

class Painting {

  constructor(title) {
    this.title = title;
    this.colour = {};
    this.times = [
      'night',
      'twilight',
      'day'
    ];
    this.aspectRatios = [
      1.2, /* Purdy - 6/5 */
      1.33333333333, /* Old School TV - 4/3 */
      1.4, /* Photo - 7/5 */
      1.77777777778 /* 16/9 */
    ];
    this.colourSchemes = [
      'mono',
      'triad'
    ];
  }

  generatePainting() {
    seedrandom(this.title, { global: true });

    /* Generate World Constants */
    this.time = this.getTime();
    this.aspectRatio = this.getAspectRatio();
    this.colourScheme = this.getColourScheme();
    this.horizon = this.getRatio();
    this.fog = this.getFog();
    
    /* Generate World Colours */
    this.colour.sky = this.getSkyColour();
    this.colour.horizon = this.getHorizonColour();
    this.colour.land = this.getLandColour();
    this.colour.fog = this.getFogColour();
    this.colour.feature = this.getFeatureColour();

    /* Set Up Environment */
    this.container = document.querySelector('.container');
    this.container.innerHTML = "";
    this.canvas = this.generateCanvas();
    this.infoCard = getInfoCard(this.title);
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.infoCard);

    /* Draw Stuff */
    this.drawSky();
    this.drawLand();
    this.drawFeature();
    this.drawFog();
  }

  generateCanvas() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvas = document.createElement('canvas');
    let windowAspectRatio = width / height;
    
    if (windowAspectRatio > this.aspectRatio) {
      canvas.height = height * .75;
      canvas.width = canvas.height * this.aspectRatio;
    } else {
      canvas.width = width * .88;
      canvas.height = canvas.width / this.aspectRatio;
    };

    return canvas;
  }

  getTime() {
    return this.times[Math.floor(Math.random() * this.times.length)];
  }

  getAspectRatio() {
    let aspectRatio;
    if (randBool(30)) {
      aspectRatio = this.aspectRatios[Math.floor(Math.random() * (this.aspectRatios.length - 1))];
      aspectRatio = 1 / aspectRatio;
    } else {
      aspectRatio = this.aspectRatios[Math.floor(Math.random() * this.aspectRatios.length)];
    }
    return aspectRatio;
  }

  getRatio() {
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
  }

  getColourScheme() {
    return this.colourSchemes[Math.floor(Math.random() * this.colourSchemes.length)];
  }

  getSkyColour() {
    let h = rotateHue(randBias(0,240,60,1),180); // Random hue between cyan and yellow, bias towards blue
    let s = randBias(0, 100, 60, 1);
    let l;
    if (this.time == 'night') {
      l = randBias(0, 100, 25, 1);
    } else if (this.time == 'twilight') {
      l = randBias(0, 100, 35, 1);
    } else {
      l = randBias(0, 100, 60, 1);
    }
    return [h,s,l];
  }

  getHorizonColour() {
    let horizonH = rotateHue(this.colour.sky[0],randInt(0,30));
    let horizonS = this.colour.sky[1];
    let horizonL = randBias(this.colour.sky[2] - 5, this.colour.sky[2] + 40, this.colour.sky[2] + 10, 1);
    return [horizonH,horizonS,horizonL];
  }

  getSkyFill() {
    let fill = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    let horizonH = rotateHue(this.colour.sky[0],randInt(0,30));
    let horizonS = this.colour.sky[1];
    let horizonL = randBias(this.colour.sky[2] - 5, this.colour.sky[2] + 40, this.colour.sky[2] + 10, 1);
    this.colour.horizon = [horizonH,horizonS,horizonL];
    fill.addColorStop(0, hsl(this.colour.sky));
    fill.addColorStop(1, hsl(this.colour.horizon))
    return fill;
  }

  drawSky() {
    var skyFill = this.getSkyFill();
    this.ctx.fillStyle = skyFill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getLandColour() {
    let skyH = this.colour.sky[0];
    let skyS = this.colour.sky[1];
    let skyL = this.colour.sky[2];
    let h;
    if (this.colourScheme == 'mono') {
      h = randBias(skyH  - 30, skyH + 30, skyH,1);
    } else if ((this.colourScheme == 'triad')) {
      h = rotateHue(skyH,randBias(105,135,120,1));
    }
    let s = randBias(skyS  - 15, skyS + 15, skyS,1);
    let l;
    if (this.time == 'night') {
      l = randBias(5, 30, 18,1);
    } else if (this.time == 'twilight') {
      l = randBias(10, 50, 20, 1);
    } else {
      l = randBias(10,70,25,1);
    }
    return [h,s,l];
  }

  getLandFill(landHeight,landY) {
    let fill = this.ctx.createLinearGradient(0, landY, 0, landY + landHeight);
    let horizonH = rotateHue(this.colour.land[0],randInt(0,30));
    let horizonS = this.colour.land[1] * .6;
    let horizonL = randBias(this.colour.land[1] - 5,this.colour.land[1] + 10, this.colour.land[1] + 7, 1);
    this.colour.landHorizonColour = [horizonH,horizonS,horizonL];
    let fogBlur = this.fog / 40;
    fill.addColorStop(0, hsl(this.colour.horizon));
    fill.addColorStop(fogBlur, hsl(this.colour.landHorizonColour));
    fill.addColorStop(1, hsl(this.colour.land));
    return fill;
  }

  drawLand() {
    let landHeight = this.canvas.height * this.horizon;
    let landY = this.canvas.height - landHeight;
    let landFill = this.getLandFill(landHeight,landY);
    this.ctx.fillStyle = landFill;
    this.ctx.fillRect(0, landY, this.canvas.width, landHeight);
  }

  getFeature() {
    let feature;
    feature = randBias(0,100,25,1) / 100;
    return feature;
  }

  getFeatureColour() {
    let horizonH = this.colour.horizon[0];
    let horizonS = this.colour.horizon[1];
    let horizonL = this.colour.horizon[2];
    let h = randBias(horizonH  - 15, horizonH + 15, horizonH,1);
    let s = randBias(horizonS  - 15, horizonS + 15, horizonS,1);
    let l = randBias(horizonL  - 15, horizonL + 15, horizonL,1);
    return [h,s,l];
  }

  getFeatureFill() {
    let featureFill = 'red';
    return featureFill;
  }

  drawFeature() {
    //let featureFill = this.getFeatureFill();
    //this.ctx.fillStyle = featureFill;
    //this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getFogColour() {
    let horizonH = this.colour.horizon[0];
    let horizonS = this.colour.horizon[1];
    let horizonL = this.colour.horizon[2];
    let h = randBias(horizonH  - 15, horizonH + 15, horizonH,1);
    let s = randBias(horizonS  - 15, horizonS + 15, horizonS,1);
    let l = randBias(horizonL  - 15, horizonL + 15, horizonL,1);
    return [h,s,l];
  }

  getFogFill() {
    let fogFill = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    fogFill.addColorStop(0, hsla(this.colour.sky,this.fog / 2));
    fogFill.addColorStop(1 - this.horizon, hsla(this.colour.fog,this.fog));
    fogFill.addColorStop(1, hsla(this.colour.land,this.fog / 10));
    return fogFill;
  }

  drawFog() {
    let fogFill = this.getFogFill();
    this.ctx.fillStyle = fogFill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getFog() {
    let fog;
    fog = randBias(0,100,25,1) / 100;
    return fog;
  }
}

let painting = new Painting(titleCase(Sentencer.make(getTitleTemplate())));
painting.generatePainting();

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

function hsla(array,alpha) {
  let h = array[0];
  let s = array[1];
  let l = array[2];
  return 'hsl(' + h + ',' + s + '%,' + l + '%, ' + alpha + ')';
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
}

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
      if (word != ' ') {
        return word;
      }
    }
  }).join(' ');
}

function enterTitle(current) {
  var title = prompt("Please enter a title.",current);
  if (title != null) {
    generatePainting(title);
  }
}