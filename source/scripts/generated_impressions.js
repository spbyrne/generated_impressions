const Packery = require('packery');
const Artist = require('./artist.js');
const painter = new Artist();
const gallery = document.querySelector('.wrapper');

painter.paint(15).display(gallery);

let pckry = new Packery( gallery, {
  itemSelector: '.painting'
});