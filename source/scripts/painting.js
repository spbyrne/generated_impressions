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
    this.landSamples = {};
    this.colour = this.getColour();
    this.fill = this.getFill();
    this.moon = this.getMoon();
    this.stars = this.getStars();
  }

  paint() {
    /* Paint Sky */
    this.ctx.fillStyle = this.fill.sky;
    this.ctx.beginPath();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.stars.length; i++) {
      let star = this.stars[i];
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, 360);
      this.ctx.fillStyle = "hsla(" + star.hue + ", " + star.sat + "%, 88%, " + star.alpha + ")";
      this.ctx.fill();
    };

    this.moon.draw(this);

    /* Paint Land */
    this.ctx.fillStyle = this.fill.land;
    this.ctx.beginPath();
    this.ctx.fillRect(0, this.landY - this.landHeight * this.horizonBlur, this.canvas.width, this.landHeight + this.landHeight * this.horizonBlur);

    /* Paint Feature */
    this.ctx.fillStyle = this.fill.feature;
    this.ctx.beginPath();
    this.ctx.moveTo(this.feature.x1,this.feature.y1);
    this.ctx.lineTo(this.feature.x2,this.feature.y2);
    this.ctx.lineTo(this.feature.x3,this.feature.y3);
    this.ctx.fill(); 

    /* Paint Fog */
    this.ctx.fillStyle = this.fill.fog;
    this.ctx.beginPath();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    /* Paint Tree Shadows */
    this.ctx.fillStyle = this.fill.shadow;
    this.ctx.beginPath();
    for (let i = 0; i < this.trees.length; i++) {
      let tree = this.trees[i];
      this.fill.tree[i] = this.getTreeFill(tree);
      this.paintTreeShadow(tree,i);
    }
    this.ctx.closePath();
    this.ctx.globalCompositeOperation = 'multiply';
    this.ctx.fill(); 
    this.ctx.globalCompositeOperation = 'source-over';

    /* Paint Trees */
    for (let i = 0; i < this.trees.length; i++) {
      let tree = this.trees[i];
      this.ctx.beginPath();
      this.paintTree(tree,i);
    }

    return this;
  }

  paintTreeShadow(tree, i) {
    let tipX = tree.x + (tree.width / 2);
    let tipY = tree.y + (tree.height / 4);
    this.ctx.moveTo(tree.x, tree.y);
    this.ctx.bezierCurveTo(tipX,tipY,tipX,tipY,tree.x + tree.width, tree.y);
  }

  paintTree(tree,i) {
    let tipX = tree.x + (tree.width / 2);
    let tipY = tree.y - tree.height;
    this.ctx.fillStyle = this.fill.tree[i];
    this.ctx.beginPath();
    this.ctx.moveTo(tree.x, tree.y);
    this.ctx.bezierCurveTo(tipX,tipY,tipX,tipY,tree.x + tree.width, tree.y);
    this.ctx.closePath();
    this.ctx.fill(); 
  }

  generateCanvas() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let windowUnit = (width + height) / 2;
    let canvas = document.createElement('canvas');
    let windowAspectRatio = width / height;
    
    if (windowAspectRatio > this.aspectRatio) {
      canvas.height = windowUnit;
      canvas.width = canvas.height * this.aspectRatio;
    } else {
      canvas.width = windowUnit;
      canvas.height = canvas.width / this.aspectRatio;
    };

    return canvas;
  }

  getTime() {
    let times = super.getTimes();
    return times[Math.floor(this.rnd() * times.length)];
  }

  getAspectRatio() {
    let aspectRatios = super.getAspectRatios();
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
    const ratios = super.getRatios();
    let minRatio = Math.min(...ratios);
    let ratioBias = ratios[Math.floor(this.rnd() * ratios.length)];
    ratioBias = (this.randBool()) ? 1 - ratioBias : ratioBias;
    let ratio = this.randBias(minRatio,1-minRatio,ratioBias,'easeInQuint');
    return ratio;
  }

  getColourScheme() {
    const colourSchemes = super.getColourSchemes();
    return colourSchemes[Math.floor(this.rnd() * colourSchemes.length)];
  }

  getColour() {
    let colour = {};
    let colourMod, colourWiggle = 0;

    if (this.colourScheme == 'mono') {
      colourMod = 0;
      colourWiggle = 10;
    } else if ((this.colourScheme == 'analogous')) {
      colourMod = 25;
      colourWiggle = 15; 
    } else if ((this.colourScheme == 'comp')) {
      colourMod = 180;
      colourWiggle = 20;
    } else if ((this.colourScheme == 'triad')) {
      colourMod = 120;
      colourWiggle = 10;
    }
    colourMod = (super.randBool()) ? -1 * colourMod : colourMod;

    /* Sky */
    let skyH, skyS, skyL;
    if (this.randBool(10)) {
      skyH = super.randInt(0,360);
    } else if (this.time == 'night') {
      skyH = super.rotateHue(super.randBias(0,75,30,'easeOutQuad',true),200)
    } else if (this.time == 'twilight') {
      skyH = super.rotateHue(super.randBias(0,230,40,'easeInQuint',true),190)
    } else {
      skyH = super.rotateHue(super.randBias(0,230,40,'easeInQuint',true),190)
    }
    if (this.time == 'night') {
      skyS = super.randBias(0, 100, 50,'easeInQuint');
    } else if (this.time == 'twilight') {
      skyS = super.randBias(0, 100, 55,'easeInQuint');
    } else {
      skyS = super.randBias(0, 100, 60,'easeInQuint');
    }
    if (this.time == 'night') {
      skyL = super.randBias(8, 35, 15,'easeOutQuad');
    } else if (this.time == 'twilight') {
      skyL = super.randBias(16, 45, 30,'easeOutQuad');
    } else {
      skyL = super.randBias(32, 90, 65,'easeOutQuad');
    }
    colour.sky = [skyH,skyS,skyL];
    
    /* Horizon */
    let horizonWiggle, horizonH, horizonS, horizonL;
    horizonWiggle = super.randBias(0,colourWiggle * 2,colourWiggle,'easeOutQuad',true) - colourWiggle;
    horizonH = (super.randBool(50)) ? super.rotateHue(skyH,colourMod + horizonWiggle) : super.rotateHue(skyH,super.randInt(0,30));
    horizonS = skyS;
    horizonL = super.randBias(skyL - 5, Math.min(skyL + 40,95), Math.min(skyL + 7,90), 'easeInQuint');
    colour.horizon = [horizonH,horizonS,horizonL];

    /* Land */
    let landWiggle, landH, landS, landL;
    landWiggle = super.randBias(0,colourWiggle * 2,colourWiggle,'easeOutQuad',true) - colourWiggle;
    landH = super.rotateHue(skyH,colourMod + landWiggle);
    landS = super.randBias(skyS  - 15, skyS + 15, skyS);
    if (this.time == 'night') {
      landL = super.randBias(5, 30, 18);
    } else if (this.time == 'twilight') {
      landL = super.randBias(10, 50, 20);
    } else {
      landL = super.randBias(10,70,25);
    }
    colour.land = [landH,landS,landL];

    /* Feature */
    let featureWiggle, featureH, featureS, featureL, featureMinS, featureMaxS, featureMinL, featureMaxL, featureSourceH, featureSourceS, featureSourceL;
    featureWiggle = super.randBias(0,colourWiggle * 2,colourWiggle,'easeOutQuad',true) - colourWiggle;
    featureSourceH = (super.randBool()) ? skyH : landH;
    featureSourceS = (super.randBool()) ? skyS : landS;
    featureSourceL = (super.randBool()) ? skyL : landL;
    featureMinS = 15;
    featureMaxS = 100;
    featureMinL = 5;
    featureMaxL = 60;
    featureSourceS = (featureSourceS < featureMinS) ? featureMinS : (featureSourceS > featureMaxS) ? featureMaxS : featureSourceS;
    featureSourceL = (featureSourceL < featureMinL) ? featureMinL : (featureSourceL > featureMaxL) ? featureMaxL : featureSourceL;
    featureH = super.rotateHue(featureSourceH,colourMod + featureWiggle);
    featureS = super.randBias(featureMinS,featureMaxS,featureSourceS,'easeInOutQuad');
    featureL = super.randBias(featureMinL,featureMaxL,featureSourceL,'easeInOutQuad');
    colour.feature = [featureH,featureS,featureL];

    /* Fog */
    let fogH, fogS, fogL, fogMinH, fogMinS, fogMinL, fogMaxH, fogMaxS, fogMaxL, fogWiggle, fogSourceH, fogSourceS, fogSourceL;
    fogSourceH = skyH;
    fogSourceS = colour.horizonS;
    fogSourceL = colour.horizonL;
    fogMinS = 10;
    fogMinL = 10;
    fogMaxS = 50;
    fogMaxL = 80;
    fogH = fogSourceH;
    fogS = super.randBias(fogMinS,fogMaxS,fogSourceS);
    fogL =super.randBias(fogMinL,fogMaxL,fogSourceL);
    colour.fog = [fogH,fogS,fogL];

    /* Land Horizon */
    colour.landHorizon = super.mixHsl(colour.fog,colour.land,this.fog,1-this.fog);

    /* Feature Mid */
    let featureMidH, featureMidS, featureMidL;
    featureMidH = (featureH + horizonH) / 2;
    featureMidS = featureS * .6;
    featureMidL = super.randBias(featureMinL, featureMaxL, featureL, 'easeInQuint');
    let featureMid = super.mixHsl(colour.fog,[featureMidH,featureMidS,featureMidL],1-this.fog,this.fog);
    let featureMix = super.randBias(0,100,75,'easeOutQuad') / 100;
    featureMid = super.mixHsl(featureMid,colour.feature,featureMix,1-featureMix);
    colour.featureMid = featureMid;

    /* Tree */
    let treeWiggle, treeH, treeS, treeL, treeMinS, treeMaxS, treeMinL, treeMaxL, treeSourceH, treeTargetS, treeTargetL;
    treeWiggle = super.randBias(0,colourWiggle * 2,colourWiggle,'easeOutQuad',true) - colourWiggle;
    treeSourceH = (super.randBool()) ? skyH : landH;
    treeMinS = 5;
    treeMaxS = 100;
    treeTargetS = 15;
    treeMinL = 5;
    treeMaxL = 60;
    treeTargetL = 15; 
    treeH = super.rotateHue(treeSourceH,colourMod + treeWiggle);
    treeS = super.randBias(treeMinS,treeMaxS,treeTargetS,'easeInOutQuad');
    treeL = super.randBias(treeMinL,treeMaxL,treeTargetL,'easeInOutQuad');
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
    sky.addColorStop(this.horizon + this.horizonBlur, super.hsl(colour.horizon));
    fill.sky = sky;
    
    /* Land */
    let land;
    land = this.ctx.createLinearGradient(0, this.landY - this.landHeight * this.horizonBlur, 0, this.landY + this.landHeight);
    land.addColorStop(0, super.hsla(colour.horizon,0));
    land.addColorStop(this.horizonBlur * 3, super.hsl(super.mixHsl(colour.landHorizon,colour.horizon,0.5,0.5)));
    land.addColorStop(0.5, super.hsl(colour.landHorizon));
    land.addColorStop(1, super.hsl(colour.land));
    fill.land = land;
    
    /* Shadow */
    let shadow, shadowAlpha, horizonL, shadowAlphaMod;
    horizonL = this.colour.horizon[2];
    shadowAlphaMod = horizonL / 95; 
    shadowAlpha = (1 - this.fog) * shadowAlphaMod * 0.5;
    shadow = this.ctx.createLinearGradient(0, this.landY - (this.landY * this.horizonBlur), 0, this.landY + this.landHeight);
    shadow.addColorStop(0, super.hsla(colour.horizon,0));
    shadow.addColorStop(this.horizonBlur * 2, super.hsla(super.darkenHsl(super.mixHsl(colour.landHorizon,colour.horizon,0.5,0.5),shadowAlpha),0));
    shadow.addColorStop(0.5, super.hsla(super.darkenHsl(colour.landHorizon,0),shadowAlpha));
    shadow.addColorStop(1, super.hsla(super.darkenHsl(colour.land,0),shadowAlpha));
    fill.shadow = shadow;

    /* Feature */
    let feature;
    feature = this.ctx.createLinearGradient(0, this.landY, 0, this.landY + this.landHeight);
    feature.addColorStop(0, super.hsla(colour.horizon,0));
    feature.addColorStop(this.horizonBlur, super.hsla(super.mixHsl(colour.horizon,colour.featureMid,1-this.fog,this.fog),1 - this.fog));
    feature.addColorStop(this.horizonBlur + 0.5 * this.fog, super.hsla(colour.featureMid,0.8));
    feature.addColorStop(1, super.hsl(colour.feature));
    fill.feature = feature;

    /* Fog */
    let fog;
    fog = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    let upperFogAlpha = super.randBias(this.ease.easeInQuad(this.fog),this.fog,this.ease.easeOutQuint(this.fog));
    let lowerFogAlpha = super.randBias(this.fog * 0.4,this.fog,this.fog * 0.8, 'easeInQuint');
    fog.addColorStop(0, super.hsla(colour.fog,upperFogAlpha));
    fog.addColorStop(this.horizon, super.hsla(colour.fog,this.fog));
    fog.addColorStop(1, super.hsla(colour.fog,lowerFogAlpha));
    fill.fog = fog;

    fill.tree = [];

    return fill;
  }

  getLocalGroundColour(y) {
    let sampleY, sampleX;
    sampleY = (y < this.landY) ? landY + 1 : (y >= this.canvas.height) ? this.canvas.height - 1 : y;
    sampleX = (this.feature.x2 < 3) ? this.canvas.width - 1 : 1;
    if (this.landSamples.sampleY == undefined) {
      this.landSamples.sampleY = super.getHslFromPoint(sampleX,sampleY);
    }
    return this.landSamples.sampleY;
  }

  getTreeFill(tree) {
    let treeFill, groundColour;
    groundColour = this.getLocalGroundColour(tree.y);

    tree.colour = {};
    tree.colour.topMod = (1 - this.fog) * this.ease.easeOutQuint(tree.sizeMod);
    tree.colour.bottomMod = (1 - this.fog) * this.ease.easeOutQuad(tree.sizeMod);
    tree.colour.top = super.mixHsl(this.colour.fog,this.colour.tree,1 - tree.colour.topMod, tree.colour.topMod);
    tree.colour.bottom = super.mixHsl(groundColour,this.colour.tree,1 - tree.colour.bottomMod, tree.colour.bottomMod);

    treeFill = this.ctx.createLinearGradient(0, tree.y - tree.height, 0, tree.y);
    treeFill.addColorStop(0, super.hsl(tree.colour.top));
    treeFill.addColorStop(1, super.hsl(tree.colour.bottom));

    return treeFill;
  }

  getMoon() {
    let moon = {};
    moon.radius = super.randBias(this.unit / 40,this.unit / 10,this.unit / 25);
    moon.x = this.canvas.width * this.getRatio();
    let minY = moon.radius * 2;
    let maxY = this.landY + moon.radius;
    moon.y = minY + maxY * this.rnd();
    moon.partial = super.randBool();
    moon.opacity = (this.time == 'night') ? 0.4 : (this.time == 'twilight') ? 0.3 : 0.1;
    moon.opacity = (1 - this.fog) * moon.opacity;
    moon.fillStyle = 'hsla(0,0%,100%,' + moon.opacity + ')';

    moon.draw = function(painting) {
      let ctx = painting.ctx;
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(moon.x, moon.y, moon.radius, 0, 2 * Math.PI);
      ctx.fillStyle = painting.fill.sky;
      ctx.fill();
      ctx.fillStyle = moon.fillStyle;
      ctx.fill();
      ctx.closePath();
      if (moon.partial) {
        ctx.fillStyle = painting.fill.sky;
        ctx.beginPath();
        ctx.arc(moon.x + (moon.radius * 0.5), moon.y, moon.radius * 1.125, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      }
    };
    return moon;
  }

  getStars() {
    let stars = [];
    let starCount = 0;
    if (this.time == 'night') {
      starCount = (super.randBool(10)) ? super.randBias(350,1500,800) : 0;
    } else if (this.time == 'twilight') {
      starCount = (super.randBool(5)) ? super.randBias(350,1500,800) : 0;
    }
    for (let i = 0; i < starCount; i++) {
      let star = {};
      star.x = this.rnd() * this.canvas.width;
      star.y = this.rnd() * (this.canvas.height - this.landHeight);
      let mod = this.rnd();
      star.radius = mod * (this.unit / 500);
      let proximity = (this.landY - star.y) / this.landY;
      star.alpha = Math.min(this.ease.easeOutQuad(proximity) * this.ease.easeOutQuad(1 * mod), 0.8);
      star.hue = 220;
      star.sat = super.randInt(50,100);
      stars.push(star);
    }
    return stars;
  }

  getFeature() {
    let feature = {};
    let minUnit = this.unit / 20;
    let bias = this.canvas.width / 3;
    if (super.randBool()) {
      bias = this.canvas.width - bias;
    }

    feature.x1 = super.randBias(minUnit,this.canvas.width - minUnit,bias,'easeOutQuad');
    feature.y1 = this.landY + this.landHeight * this.horizonBlur;
    feature.x2bias = (feature.x1 < this.canvas.width / 2) ? this.canvas.width * .33 : this.canvas.width * .66;
    feature.width = super.randBias(this.canvas.width / 10,this.canvas.width,this.canvas.width/1.6,'easeOutQuad');
    feature.x2 = super.randBias(-this.canvas.width*1.5,this.canvas.width*2.5,feature.x2bias,'easeOutQuad') - (feature.width / 2);
    feature.y2 = this.canvas.height;
    feature.x3 = feature.x2  + feature.width;
    feature.y3 = this.canvas.height;
    
    let addedHeight = this.unit / 3;
    feature.poly = [[feature.x1,feature.y1],[feature.x2,feature.y2],[feature.x2,feature.y2 + addedHeight],[feature.x3,feature.y3 + addedHeight],[feature.x3,feature.y3]];

    return feature;
  }

  getTrees() {
    let trees = [];
    let dense = super.randBool();
    let number = dense ? super.randBias(100,1000,200,'easeOutQuad') : super.randBias(0,100,0,'easeInQuad');
    let heightBias = super.randBias(this.unit / 10, this.unit * 2, this.unit / 2);
    let widthBias = heightBias / 2.5;
    for (let i = 0; i < number; i++) {
      let tree = this.getTree(heightBias,widthBias,dense);
      trees.push(tree);
    }
    trees.sort(function(a, b){
      return a.y-b.y
    });
    return trees;
  }

  getTree(heightBias,widthBias,dense) {
    let tree = {};
    tree.height = super.randBias(this.unit / 10, this.unit * 2, heightBias, 'easeInQuint');
    tree.width = super.randBias(this.unit / 60, tree.height / 2, widthBias, 'easeInQuint');
    tree.localUnit = (this.unit / 3);
    tree.minY = this.landY;
    tree.maxY = this.canvas.height + this.unit / 6;
    tree.yBias = tree.minY;

    do {
      tree.x = -tree.localUnit + super.randInt(0,this.canvas.width + (tree.localUnit * 2));
      if (dense) {
        tree.y = (super.randBool(1)) ? super.randInt(tree.minY,tree.maxY) : super.randBias(tree.minY,tree.maxY,tree.yBias,'easeInExpo');
      } else {
        tree.y = super.randBias(tree.minY,tree.maxY,tree.yBias,'easeInQuint');
      }
    }
    while(super.inside([tree.x,tree.y],this.feature.poly))

    tree.sizeMod = (tree.y - this.landY) / this.landHeight;
    tree.width = tree.width * tree.sizeMod;
    tree.height = tree.height * tree.sizeMod;

    if (super.inside([tree.x + tree.width,tree.y],this.feature.poly)) {
      tree.x = tree.x - super.randBias(tree.width,tree.width * 2,tree.width,'easeOutQuad');
    }

    if (super.inside([tree.x + tree.width / 2,tree.y],this.feature.poly)) {
      tree.x = tree.x + super.randBias(tree.width,tree.width * 2,tree.width * 2,'easeOutQuad');
    }

    return tree;
  }

  getFog() {
    let fog;
    fog = this.ease.easeOutQuad(super.randBias(0,90,15) / 100);
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