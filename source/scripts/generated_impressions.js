let Sentencer = require('sentencer');
let seedrandom = require('seedrandom');
let ColorScheme = require('color-scheme');
let fakerator = require("fakerator/dist/locales/en-CA")();
let chroma = require("chroma-js");

let ease = {
  linear: function (t) { return t },
  easeInQuad: function (t) { return t*t },
  easeOutQuad: function (t) { return t*(2-t) },
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  easeInCubic: function (t) { return t*t*t },
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  easeInQuart: function (t) { return t*t*t*t },
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  easeInQuint: function (t) { return t*t*t*t*t },
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

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

class Artist {
  constructor(title) {
    this.name = "Anna Denson"
    this.title = title;
    this.rnd = seedrandom(this.title);
  }

  rotateHue(hue,rotation) {
    let rotatedHue;
    rotatedHue = hue - rotation;
    if (rotatedHue < 0) {
      rotatedHue = 360 + rotatedHue;
    }
    return rotatedHue;
  }
  
  hsl(array) {
    let h = array[0];
    let s = array[1];
    let l = array[2];
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  }
  
  hsla(array,alpha) {
    let h = array[0];
    let s = array[1];
    let l = array[2];
    return 'hsl(' + h + ',' + s + '%,' + l + '%, ' + alpha + ')';
  }

  randBias(min, max, bias, influence = 1, easingOption = 'easeInOutQuad') {
    let random, odds;
    do {
    random = Math.random() * (max - min) + min;
    odds = (random > bias) ? (max - random) / (max - bias) : (random - min) / (bias - min);
    odds = Math.pow(odds,influence);
    odds = ease[easingOption](odds);
    }
    while (Math.random() > odds)2
    return random;
  }
  
  randInt(min, max) {
    let int;
    min = Math.ceil(min);
    max = Math.floor(max);
    int = Math.floor(this.rnd() * (max - min + 1)) + min;
    return int;
  }
  
  randDecimal(min) {
    let random;
    random = this.rnd();
    if (min) {
      random = min + ((1 - min) * random);
    }
    return random;
  }
  
  randBool(odds) {
    let bool;
    if (odds == undefined) {
      bool = this.rnd() >= 0.5;
    } else {
      bool = this.rnd() <= (odds / 100);
    }
    return bool;
  }
}

class Painting extends Artist {

  constructor(title) {
    super(title);
    this.colour = {};

    /* Generate World Constants */
    this.time = this.getTime();
    this.aspectRatio = this.getAspectRatio();
    this.colourScheme = this.getColourScheme();
    this.horizon = this.getRatio();
    this.fog = this.getFog();

    /* Set Up Environment */
    this.container = document.createElement("div"); 
    this.container.classList.add('container');
    this.canvas = this.generateCanvas();
    this.infoCard = getInfoCard(this.title,this.name);
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.infoCard);

    /* Set Up Scene Objects */
    this.landHeight = this.canvas.height * this.horizon;
    this.landY = this.canvas.height - this.landHeight;
    this.feature = this.getFeature();


    /* Generate World Colours */
    this.colour.sky = this.getSkyColour();
    this.colour.horizon = this.getHorizonColour();
    this.colour.skyFill = this.getSkyFill();
    this.colour.land = this.getLandColour();
    this.colour.landFill = this.getLandFill();
    this.colour.fog = this.getFogColour();
    this.colour.fogFill = this.getFogFill();
    this.colour.feature = this.getFeatureColour();
  }

  paint() {
    /* Paint Sky */
    this.ctx.fillStyle = this.colour.skyFill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    /* Paint Land */
    this.ctx.fillStyle = this.colour.landFill;
    this.ctx.fillRect(0, this.landY, this.canvas.width, this.landHeight);

    /* Paint Feature */
    this.ctx.fillStyle = this.featureFill;

    /* Paint Fog */
    this.ctx.fillStyle = this.colour.fogFill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.lineWidth = 100;
    this.ctx.fillStyle = 'red';
    this.ctx.moveTo(this.feature.x1,this.feature.y1);
    this.ctx.lineTo(this.feature.x2,this.feature.y2);
    this.ctx.stroke();
  }

  display(container) {
    container.appendChild(this.container);
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

  times() {
    return [
      'night',
      'twilight',
      'day'
    ];
  }
  
  aspectRatios() {
    return [
      1.2, /* Purdy - 6/5 */
      1.33333333333, /* Old School TV - 4/3 */
      1.4, /* Photo - 7/5 */
      1.77777777778 /* 16/9 */
    ];
  }

  colourSchemes() {
    return [
      'mono',
      'triad'
    ];
  }

  getTime() {
    let times = this.times();
    return times[Math.floor(this.rnd() * times.length)];
  }

  getAspectRatio() {
    let aspectRatios = this.aspectRatios();
    let aspectRatio;
    if (randBool(30)) {
      aspectRatio = aspectRatios[Math.floor(this.rnd() * (aspectRatios.length - 1))];
      aspectRatio = 1 / aspectRatio;
    } else {
      aspectRatio = aspectRatios[Math.floor(this.rnd() *aspectRatios.length)];
    }
    return aspectRatio;
  }

  getRatio() {
    let ratio = 1;
    let goldenRatio = 1.6180339887498948482045868;
    let exponent = super.randBias(1,4,2,1);
    let inverse = super.randBool(30);
    for (let i = 0; i < exponent; i++) {
      ratio = ratio / goldenRatio;
    }
    if (inverse) {
      ratio = 1 - ratio;
    }
    ratio = super.randBias(ratio / 2, ratio * 1.5, ratio, 1, 'easeInQuint');
    return ratio;
  }

  getColourScheme() {
    let colourSchemes = this.colourSchemes();
    return colourSchemes[Math.floor(this.rnd() * colourSchemes.length)];
  }

  getSkyColour() {
    let h = super.rotateHue(randBias(0,240,60,1),180); // Random hue between cyan and yellow, bias towards blue
    let s = super.randBias(0, 100, 60, 1);
    let l;
    if (this.time == 'night') {
      l = super.randBias(0, 100, 25, 2);
    } else if (this.time == 'twilight') {
      l = super.randBias(0, 100, 35, 2);
    } else {
      l = super.randBias(0, 100, 60, 1);
    }
    return [h,s,l];
  }

  getHorizonColour() {
    let horizonH = super.rotateHue(this.colour.sky[0],super.randInt(0,30));
    let horizonS = this.colour.sky[1];
    let horizonL = super.randBias(this.colour.sky[2] - 5, this.colour.sky[2] + 40, this.colour.sky[2] + 10, 1);
    return [horizonH,horizonS,horizonL];
  }

  getSkyFill() {
    let fill = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    fill.addColorStop(0, super.hsl(this.colour.sky));
    fill.addColorStop(1 - this.horizon, super.hsl(this.colour.horizon))
    return fill;
  }

  getLandColour() {
    let skyH = this.colour.sky[0];
    let skyS = this.colour.sky[1];
    let skyL = this.colour.sky[2];
    let h;
    if (this.colourScheme == 'mono') {
      h = super.randBias(skyH  - 30, skyH + 30, skyH,1);
    } else if ((this.colourScheme == 'triad')) {
      h = super.rotateHue(skyH, super.randBias(105,135,120,1));
    }
    let s = super.randBias(skyS  - 15, skyS + 15, skyS,1);
    let l;
    if (this.time == 'night') {
      l = super.randBias(5, 30, 18,1);
    } else if (this.time == 'twilight') {
      l = super.randBias(10, 50, 20, 1);
    } else {
      l = super.randBias(10,70,25,1);
    }
    return [h,s,l];
  }

  getLandFill() {
    let fill = this.ctx.createLinearGradient(0, this.landY, 0, this.landY + this.landHeight);
    let horizonH = super.rotateHue(this.colour.land[0], super.randInt(0,30));
    let horizonS = this.colour.land[1] * .6;
    let horizonL = super.randBias(this.colour.land[2] - 5,this.colour.land[2] + 20, this.colour.land[2] + 6, 3);
    this.colour.landHorizonColour = [horizonH,horizonS,horizonL];
    let fogBlur = ease.easeInQuad(this.fog) / 10;
    fill.addColorStop(0, super.hsl(this.colour.horizon));
    fill.addColorStop(fogBlur, super.hsl(this.colour.landHorizonColour));
    fill.addColorStop(1, super.hsl(this.colour.land));
    return fill;
  }

  getFeature() {
    let feature = {};
    let cW = this.canvas.width;
    let cH = this.canvas.height;
    let minUnit = cW / 20;
    let bias = cW / 3;
    if (super.randBool()) {
      bias = cW - bias;
    }
    feature.x1 = super.randBias(minUnit,cW - minUnit,bias,1,'easeOutQuad');
    feature.y1 = cH * (1 - this.horizon);
    feature.x2 = super.randBias(-cW*1.5,cW*2.5,cW/2,1,'easeOutQuad');
    feature.y2 = cH;
    return feature;
  }

  getFeatureColour() {
    let horizonH = this.colour.horizon[0];
    let horizonS = this.colour.horizon[1];
    let horizonL = this.colour.horizon[2];
    let h = super.randBias(horizonH  - 15, horizonH + 15, horizonH,1);
    let s = super.randBias(horizonS  - 15, horizonS + 15, horizonS,1);
    let l = super.randBias(horizonL  - 15, horizonL + 15, horizonL,1);
    return [h,s,l];
  }

  getFeatureFill() {
    let featureFill = 'red';
    return featureFill;
  }

  getFogColour() {
    let horizonH = this.colour.horizon[0];
    let horizonS = this.colour.horizon[1];
    let horizonL = this.colour.horizon[2];
    let h = super.randBias(horizonH  - 15, horizonH + 15, horizonH,1);
    let s = super.randBias(horizonS  - 15, horizonS + 15, horizonS,1);
    let l = super.randBias(25, 80, horizonL,1);
    return [h,s,l];
  }

  getFogFill() {
    let fogFill = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    let upperFogAlpha = super.randBias(ease.easeInQuad(this.fog),this.fog,ease.easeOutQuint(this.fog));
    let lowerFogAlpha = super.randBias(ease.easeInQuint(this.fog),this.fog,ease.easeInQuad(this.fog),3);
    fogFill.addColorStop(0, super.hsla(this.colour.fog,upperFogAlpha));
    fogFill.addColorStop(1 - this.horizon, super.hsla(this.colour.fog,this.fog));
    fogFill.addColorStop(1, super.hsla(this.colour.fog,lowerFogAlpha));
    return fogFill;
  }

  getFog() {
    let fog;
    fog = ease.easeOutQuad(super.randBias(0,100,10,1) / 100);
    return fog;
  }
}

let painting = new Painting(titleCase(Sentencer.make(getTitleTemplate())));
let outputElement = document.querySelector('.wrapper');
painting.paint();
painting.display(outputElement);

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

function getInfoCard(title,name) {
  let infoCard = document.createElement("div");
  infoCard.setAttribute('class', 'info-card');
  infoCard.innerHTML = "<h3 class='info-card__title'>" + title + "</h3>";
  infoCard.innerHTML += "<p class='info-card__meta'><span class='info-card__artist'>" + name + "</span>, 2019</p>";
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

