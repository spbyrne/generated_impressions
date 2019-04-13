const Artist = require('./artist.js');
const painter = new Artist();
const container = document.querySelector('.wrapper');

painter.paint(10).display(container);