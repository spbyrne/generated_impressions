const Artist = require('./artist.js');
const painter = new Artist('Anna Denson');
const container = document.querySelector('.wrapper');

painter.paint(20).display(container);