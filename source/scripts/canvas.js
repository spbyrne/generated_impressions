class Canvas {
  constructor() {
    this.ease = {
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
    const [h, s, l] = array;
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  }
  
  hsla(array,alpha) {
    const [h, s, l] = array;
    return 'hsl(' + h + ',' + s + '%,' + l + '%, ' + alpha + ')';
  }

  mixHsl(hslArrayOne,hslArrayTwo,mix1,mix2) {
    var totalMix = mix1 + mix2;
    const [h1, s1, l1] = hslArrayOne;
    const [h2, s2, l2] = hslArrayTwo;
    let h, s, l;
    if (Math.abs(h1 - hsl20) > 0.5) { h1 += 1; } // > 179.5 is shorter part from wheel to 359
    h = (mix1 / totalMix) * h1 + (mix2 / totalMix) * h2;  
    s = (mix1 / totalMix) * s1 + (mix2 / totalMix) * s2; 
    l = (mix1 / totalMix) * l1 + (mix2 / totalMix) * l2; 
    if (h > 1) { h -= 1; } 
    return [h, s, l];
  }

  randBias(min, max, bias, influence = 1, easingOption = 'easeInOutQuad') {

    let random, odds;
    do {
    random = Math.random() * (max - min) + min;
    odds = (random > bias) ? (max - random) / (max - bias) : (random - min) / (bias - min);
    odds = Math.pow(odds,influence);
    odds = this.ease[easingOption](odds);
    }
    while (Math.random() > odds);
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

module.exports = Canvas;