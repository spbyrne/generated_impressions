const seedrandom = require('seedrandom');
class Canvas {
  constructor(title) {
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
      easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
      easeInExpo: function (t) {
        return t*t*t*t*t*t*t*t*t*t*t*t*t*t*t*t*t;
      }
    }
    this.title = title;
    this.rnd = seedrandom(this.title);
  }

  getHslFromPoint(x,y) {
    let colourRGB = this.ctx.getImageData(x, y, 1, 1).data;
    let colourHSL = this.rgbToHsl(colourRGB);
    return colourHSL;
  }

  getColourSchemes() {
    const colourSchemes = [
      'mono',
      'analogous',
      'triad',
      'triad',
      'triad',
      'comp',
      'comp'
    ];
    return colourSchemes;
  }

  getTimes() {
    const times = [
      'night',
      'night',
      'twilight',
      'twilight',
      'day',
      'day',
      'day'
    ];
    return times;
  }

  getRatios() {
    const ratios = [
      0.66,
      0.61803398875,
      0.41666666666,
      0.38196601125,
      0.33,
      0.25,
      0.2360679775,
      0.2,
      0.08333333333
    ];
    return ratios; 
  }

  getAspectRatios() {
    const aspectRatios = [
      1.2, /* Purdy - 6/5 */
      1.33333333333, /* Old School TV - 4/3 */
      1.4, /* Photo - 7/5 */
      1.77777777778 /* 16/9 */
    ];
    return aspectRatios;
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
    let [h, s, l] = array;
    h = Math.round(h);
    s = Math.round(s);
    l = Math.round(l);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  }
  
  hsla(array,alpha) {
    let [h, s, l] = array;
    h = Math.round(h);
    s = Math.round(s);
    l = Math.round(l);
    return 'hsl(' + h + ',' + s + '%,' + l + '%, ' + alpha + ')';
  }

  mixHsl(hslArrayOne,hslArrayTwo,mix1,mix2) {
    let totalMix = mix1 + mix2;
    let [h1, s1, l1] = hslArrayOne;
    let [h2, s2, l2] = hslArrayTwo;
    let h, s, l;
    if (Math.abs(h1 - h2) > 0.5) { h1 += 1; } // > 179.5 is shorter part from wheel to 359
    h = (this.ease.easeInOutQuad(mix1) / totalMix) * h1 + (this.ease.easeInOutQuad(mix2) / totalMix) * h2;  
    s = (mix1 / totalMix) * s1 + (mix2 / totalMix) * s2; 
    l = (mix1 / totalMix) * l1 + (mix2 / totalMix) * l2; 
    if (h > 1) { h -= 1; } 
    return [h, s, l];
  }

  darkenHsl(hslArray,amount) {
    return [hslArray[0],hslArray[1],hslArray[2] - amount];
  }

  rgbToHsl(array) {
    let [r,g,b] = array;
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
      h = 0;
    // Red is max
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);
      
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

        // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return [ h, s, l ];
  }  

  randBias(min, max, bias, easingOption = 'easeInOutQuad', wholeNumber = false) {
    max = (max < min) ? min + 1 : max;
    bias = (bias > max) ? max : (bias < min) ? min : bias;
    let random = 0;
    let odds = 0;
    while (this.rnd() > odds) {
      if (wholeNumber) {
        random = Math.floor(this.rnd() * (max - min + 1)) + min;
      } else {
        random = this.rnd() * (max - min) + min;
      }
      odds = (random > bias) ? (max - random) / (max - bias) : (random - min) / (bias - min);
      odds = this.ease[easingOption](odds);
    }
    return random;
  }

  randFromSet(array) {
    return array[Math.floor(this.rnd() * array.length)];
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

  inside(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
  }
}

module.exports = Canvas;