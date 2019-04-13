const seedrandom = require('seedrandom');
const Canvas = require('./canvas.js');

class Painting extends Canvas {

  constructor(title) {
    super(title);
    this.title = title;
    this.rnd = seedrandom(this.title);

    /* Generate World Constants */
    this.time = this.getTime();
    this.aspectRatio = this.getAspectRatio();

    /* Set Up Environment */
    this.canvas = this.generateCanvas();
    this.ctx = this.canvas.getContext("2d");

    /* Set Up Scene Objects */
    this.unit = (this.canvas.height + this.canvas.width) / 2;
    this.colourScheme = this.getColourScheme();
    this.horizon = this.getRatio();
    this.fog = this.getFog();
    this.horizonBlur = this.ease.easeInQuad(this.fog) / 10;
    this.landY = this.canvas.height * this.horizon;
    this.landHeight = this.canvas.height - this.landY;
    this.feature = this.getFeature();
    this.trees = this.getTrees();

    /* Generate World Colours */
    this.colour = this.getColour();
    this.fill = this.getFill();
  }

  paint() {
    /* Paint Sky */
    this.ctx.fillStyle = this.fill.sky;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    /* Paint Land */
    this.ctx.fillStyle = this.fill.land;
    this.ctx.fillRect(0, this.landY, this.canvas.width, this.landHeight);

    /* Paint Feature */
    this.ctx.lineWidth = 100;
    this.ctx.fillStyle = this.fill.feature;
    this.ctx.moveTo(this.feature.x1,this.feature.y1);
    this.ctx.lineTo(this.feature.x2,this.feature.y2);
    this.ctx.lineTo(this.feature.x3,this.feature.y3);
    this.ctx.fill(); 


    /* Paint Fog */
    this.ctx.fillStyle = this.fill.fog;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    
    /* Paint Trees */
    for (let i = 0; i < this.trees.length; i++) {
      let tree = this.trees[i];
      this.ctx.fillStyle = tree.fillStyle;
      this.ctx.fillRect(tree.x, tree.y - tree.height, tree.width, tree.height);
    }

    return this;
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
    if (super.randBool(30)) {
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
    let inverse = super.randBool(70);
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

  getColour() {
    let colour = {};

    /* Sky */
    let skyH, skyS, skyL;
    skyH = super.rotateHue(super.randBias(0,240,60,1),180); // Random hue between cyan and yellow, bias towards blue
    skyS = super.randBias(0, 100, 60, 1);
    if (this.time == 'night') {
      skyL = super.randBias(0, 100, 25, 2);
    } else if (this.time == 'twilight') {
      skyL = super.randBias(0, 100, 35, 2);
    } else {
      skyL = super.randBias(0, 100, 60, 1);
    }
    colour.sky = [skyH,skyS,skyL];
    
    /* Horizon */
    let horizonH, horizonS, horizonL;
    horizonH = super.rotateHue(skyH,super.randInt(0,30));
    horizonS = skyS;
    horizonL = super.randBias(skyL - 5, skyL + 40, skyL + 10, 1);
    colour.horizon = [horizonH,horizonS,horizonL];

    /* Land */
    let landH, landS, landL;
    if (this.colourScheme == 'mono') {
      landH = super.randBias(skyH  - 30, skyH + 30, skyH,1);
    } else if ((this.colourScheme == 'triad')) {
      landH = super.rotateHue(skyH, super.randBias(105,135,120,1));
    }
    landS = super.randBias(skyS  - 15, skyS + 15, skyS,1);
    if (this.time == 'night') {
      landL = super.randBias(5, 30, 18,1);
    } else if (this.time == 'twilight') {
      landL = super.randBias(10, 50, 20, 1);
    } else {
      landL = super.randBias(10,70,25,1);
    }
    colour.land = [landH,landS,landL];

    /* Land Horizon */
    let landHorizonH, landHorizonS, landHorizonL;
    landHorizonH = super.rotateHue(landH, super.randInt(0,30));
    landHorizonS = landS * .6;
    landHorizonL = super.randBias(landL - 5,landL + 20, landL + 6, 3);
    colour.landHorizonColour = [landHorizonH,landHorizonS,landHorizonL];

    /* Feature */
    let featureH, featureS, featureL;
    if (super.randBool()) {
      featureH = super.randBias(super.rotateHue(skyH,-160), super.rotateHue(skyH,200), super.rotateHue(skyH,180),1,'easeInQuart');
    } else {
      featureH = super.randBias(super.rotateHue(skyH,-20), super.rotateHue(skyH,20), skyH,1,'easeInQuart');
    }
    featureS = super.randBias(Math.max(skyS  - 30,0), skyS + 10, skyS - 15,1);
    featureL = super.randBias(Math.max(skyL  - 20,0), skyL + 15, skyL - 10,1);
    colour.feature = [featureH,featureS,featureL];

    /* Feature Horizon */
    let featureHorizonH, featureHorizonS, featureHorizonL;
    featureHorizonH = super.rotateHue(featureH, super.randInt(0,30));
    featureHorizonS = featureS * .6;
    featureHorizonL = super.randBias(featureL - 5,featureL + 20, featureL + 6, 3);
    colour.featureHorizonColour = [featureHorizonH,featureHorizonS,featureHorizonL];

    /* Fog */
    let fogH, fogS, fogL;
    fogH = super.randBias(horizonH  - 15, horizonH + 15, horizonH,1);
    fogS = super.randBias(horizonS  - 15, horizonS + 15, horizonS,1);
    fogL = super.randBias(25, 80, horizonL,1);
    colour.fog = [fogH,fogS,fogL];

    /* Tree */
    let treeH, treeS, treeL;
    if (this.colourScheme == 'mono') {
      treeH = super.randBias(super.rotateHue(skyH,-20),super.rotateHue(skyH,20),skyH);
    } else if ((this.colourScheme == 'triad')) {
      treeH = super.randBias(super.rotateHue(skyH,100),super.rotateHue(skyH,140),super.rotateHue(skyH,-120),);
    }
    treeS = landS;
    treeL = super.randBias(20,50,30);
    colour.tree = [treeH,treeS,treeL];

    return colour;
  };

  getFill() {
    let fill = {};
    let colour = this.colour;

    /* Sky */
    let sky;
    sky = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    sky.addColorStop(0, super.hsl(colour.sky));
    sky.addColorStop(this.horizon, super.hsl(colour.horizon));
    fill.sky = sky;
    
    /* Land */
    let land;
    land = this.ctx.createLinearGradient(0, this.landY, 0, this.landY + this.landHeight);
    land.addColorStop(0, super.hsl(colour.horizon));
    land.addColorStop(this.horizonBlur, super.hsl(colour.landHorizonColour));
    land.addColorStop(1, super.hsl(colour.land));
    fill.land = land;

    /* Feature */
    let feature;
    feature = this.ctx.createLinearGradient(0, this.landY, 0, this.landY + this.landHeight);
    feature.addColorStop(0, super.hsla(colour.horizon,0));
    feature.addColorStop(this.horizonBlur * super.randInt(1,10,4), super.hsla(colour.featureHorizonColour,0.8));
    feature.addColorStop(1, super.hsl(colour.feature));
    fill.feature = feature;

    /* Fog */
    let fog;
    fog = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    let upperFogAlpha = super.randBias(this.ease.easeInQuad(this.fog),this.fog,this.ease.easeOutQuint(this.fog));
    let lowerFogAlpha = super.randBias(this.fog * 0.4,this.fog,this.fog * 0.8,3);
    fog.addColorStop(0, super.hsla(colour.fog,upperFogAlpha));
    fog.addColorStop(this.horizon, super.hsla(colour.fog,this.fog));
    fog.addColorStop(1, super.hsla(colour.fog,lowerFogAlpha));
    fill.fog = fog;

    return fill;
  };

  getFeature() {
    let feature = {};
    let minUnit = this.unit / 20;
    let bias = this.canvas.width / 3;
    if (super.randBool()) {
      bias = this.canvas.width - bias;
    }

    feature.x1 = super.randBias(minUnit,this.canvas.width - minUnit,bias,1,'easeOutQuad');
    feature.y1 = this.landY + this.landHeight * this.horizonBlur * 0.5;
    feature.x2bias = (feature.x1 < this.canvas.width / 2) ? this.canvas.width * .33 : this.canvas.width * .66;
    feature.width = super.randBias(this.canvas.width / 10,this.canvas.width,this.canvas.width/1.6,1,'easeOutQuad');
    feature.x2 = super.randBias(-this.canvas.width*1.5,this.canvas.width*2.5,feature.x2bias,1,'easeOutQuad') - (feature.width / 2);
    feature.y2 = this.canvas.height;
    feature.x3 = feature.x2  + feature.width;
    feature.y3 = this.canvas.height;
    
    let addedHeight = this.unit / 3;
    feature.poly = [[feature.x1,feature.y2],[feature.x2,feature.y2],[feature.x2,feature.y2 + addedHeight],[feature.x3,feature.y3 + addedHeight],[feature.x3,feature.y3]];

    return feature;
  }

  getTrees() {
    let trees = [];
    let number = super.randBias(0,200,20);
    let heightBias = super.randBias(this.unit / 10, this.unit * 2, this.unit * 1.5);
    let widthBias = this.unit / 80;
    for (let i = 0; i < number; i++) {
      let tree = this.getTree(heightBias,widthBias);
      trees.push(tree);
    }
    trees.sort(function(a, b){
      return a.y-b.y
    });
    return trees;
  }

  getTree(heightBias,widthBias) {
    let tree = {};
    tree.height = super.randBias(this.unit / 10, this.unit * 3, heightBias, 1, 'easeInQuint');
    tree.width = super.randBias(this.unit / 100, tree.height / 1.6, widthBias, 1, 'easeInQuint');
    tree.localUnit = (this.unit / 3);
    tree.minY = this.landY;
    tree.maxY = this.canvas.height;
    tree.yBias = tree.minY;

    do {
      tree.x = -tree.localUnit + super.randInt(0,this.canvas.width + (tree.localUnit * 2));
      tree.y = super.randBias(tree.minY,tree.maxY,tree.yBias,1,'easeInQuint');
    }
    while(this.inside([tree.x,tree.y],this.feature.poly))

    tree.sizeMod = (tree.y - this.landY) / this.landHeight;
    tree.width = tree.width * tree.sizeMod;
    tree.height = tree.height * tree.sizeMod;

    if (this.inside([tree.x + tree.width,tree.y],this.feature.poly)) {
      tree.x = tree.x - tree.width;
    }

    var colourRGB = this.ctx.getImageData(tree.x, tree.y, 1, 1).data;
    var colourHSL = super.rgbToHsl(colourRGB);
    tree.fillStyle = 'black' //super.hsl(super.mixHsl(colourHSL,this.colour.tree,tree.sizeMod, 1 - tree.sizeMod));
    return tree;
  }

  getFog() {
    let fog;
    fog = this.ease.easeOutQuad(super.randBias(0,100,10,1) / 100);
    return fog;
  }

  getInfoCard() {
    let infoCard = document.createElement("div");
    infoCard.setAttribute('class', 'info-card');
    infoCard.innerHTML = "<h3 class='info-card__title'>" + this.title + "</h3>";
    infoCard.innerHTML += "<p class='info-card__meta'><span class='info-card__artist'>" + this.name + "</span>, 2019</p>";
    infoCard.innerHTML += "<p class='info-card__meta'><span class='info-card__medium'>Javascript & HTML Canvas</span></p>";
    return infoCard;
  }
}

module.exports = Painting;