var inside = require('point-in-polygon')

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
    };
    this.inside = inside;
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
    let totalMix = mix1 + mix2;
    let [h1, s1, l1] = hslArrayOne;
    let [h2, s2, l2] = hslArrayTwo;
    let h, s, l;
    if (Math.abs(h1 - h2) > 0.5) { h1 += 1; } // > 179.5 is shorter part from wheel to 359
    h = (mix1 / totalMix) * h1 + (mix2 / totalMix) * h2;  
    s = (mix1 / totalMix) * s1 + (mix2 / totalMix) * s2; 
    l = (mix1 / totalMix) * l1 + (mix2 / totalMix) * l2; 
    if (h > 1) { h -= 1; } 
    return [h, s, l];
  }

  rgbToHsl(array) {
    let [r,g,b] = array;
    r /= 255, g /= 255, b /= 255;
  
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }
  
    return [ h, s, l ];
  }  

  randBias(min, max, bias, influence = 1, easingOption = 'easeInOutQuad') {
    let random = 0;
    let odds = 0;
    while (this.rnd() > odds) {
      random = this.rnd() * (max - min) + min;
      odds = (random > bias) ? (max - random) / (max - bias) : (random - min) / (bias - min);
      odds = this.ease[easingOption](odds);
      odds = (odds == 0) ? bias : odds;
    }
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