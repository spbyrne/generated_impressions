const Artist = require('./artist.js');

let artist = new Artist('Anna Denson');
let container = document.querySelector('.wrapper');
artist.paint().display(container);