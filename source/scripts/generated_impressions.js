const Packery = require('packery');
const Artist = require('./artist.js');
const painter = new Artist(hash);
const galleryElem = document.querySelector('.wrapper');

let gallery;
let loop = 0;

function fillViewport() {
  loop++;
  let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var galleryRect = galleryElem.getBoundingClientRect();
  var spaceBelow = (window.innerHeight - galleryRect.bottom) * -1;
  if (spaceBelow < viewportHeight * 2) {
    painter.paint(4).display(galleryElem);
    if(loop == 1) {
      gallery = new Packery( galleryElem, {
        itemSelector: '.painting',
        transitionDuration: 0
      });
    } else {
      gallery.reloadItems();
      gallery.layout();
    }
    setTimeout(function() {
      fillViewport();
    }, 50);
  };
};

fillViewport();

window.addEventListener('scroll', function() {
  fillViewport();
});