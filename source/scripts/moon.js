class Moon {
  constructor(painting) {
    this.painting = painting;
    this.fillStyle = this.getFillStyle(),
    [this.x, this.y, this.radius] = this.getProps(),
    this.draw = function() {
      this.ctx.fillStyle = this.fillStyle;
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  getProps() {
    let x, y, radius;
    radius = this.painting.unit / 10;
    x = 2;
    y = 2;
    return [x,y,radius];
  }

  getFillStyle() {
    let fillStyle;
    fillStyle = 'hsla(0,0%,100%,1)';
    return fillStyle;
  }
}

module.exports = Moon;