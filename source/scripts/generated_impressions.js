const Packery = require('packery');
const Artist = require('./artist.js');
const painter = new Artist(hash);
const galleryElem = document.querySelector('.wrapper');

let viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let paintAtTime = Math.max(Math.round(viewWidth / 800),1);
let gallery;
let loop = 0;
let fillViewportHandler = throttled(50,fillViewport);

window.addEventListener('scroll', fillViewportHandler);

function fillViewport() {
  loop++;
  let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  let galleryRect = galleryElem.getBoundingClientRect();
  let spaceBelow = (window.innerHeight - galleryRect.bottom) * -1;
  if (spaceBelow < (viewportHeight * 3)/paintAtTime) {
    painter.paint(paintAtTime).display(galleryElem);
    if(loop == 1) {
      gallery = new Packery( galleryElem, {
        itemSelector: '.painting',
        transitionDuration: 0
      });
    } else {
      gallery.reloadItems();
      gallery.layout();
    }
    fillViewport();
  };
}

function throttled(delay, fn) {
  let lastCall = 0;
  return function (...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

function paintThis(title = window.prompt("Enter a title","")) {
  painter.paint(1,title).display(galleryElem);
}

window.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    paintThis();
  }
});

fillViewport();
