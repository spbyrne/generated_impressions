const Sentencer = require('sentencer');
const fakerator = require("fakerator/dist/locales/en-CA")();
const Painting = require('./painting.js');

class Artist {
  constructor() {
    this.name = "Anna Denson";
    this.paintings = [];
    this.fakerator = fakerator;
    this.sentencer = Sentencer;
    this.sentencer.configure({
      actions: {
        place: this.getPlace(),
        name: this.getName(),
        greeting: this.getGreeting(),
        preposition: this.getPreposition(),
        mod: this.getMod()
      }
    });
  }

  paint(title = this.createTitle()) {
    let painting = new Painting(title);
    this.paintings.push(painting);
    return this;
  }

  display(container) {
    for (let paintingCount = 0; paintingCount < this.paintings.length; paintingCount++) {
      let thisPainting = this.paintings[paintingCount];
      thisPainting.display(container);
      console.log(thisPainting);
    }
  }

  createTitle() {
    let title;
    title = this.titleCase(this.sentencer.make(this.getTitleTemplate()));
    return title;
  }

  getTitleTemplate() {
    let titleTemplates = [
      'The {{ adjective }} {{ noun }}',
      'The {{ mod }} {{ noun }} of {{ noun }}',
      'The {{ mod }} {{ nouns }} {{ preposition }} {{ name }}',
      'The {{ nouns }} of {{ place }}',
      '{{ greeting }} to {{ place }}',
      '{{ an_adjective }} {{ noun }}',
      '{{ noun }} {{ preposition }} {{ nouns }}',
      '{{ adjective }} {{ nouns }}',
      '{{ nouns }} {{ preposition }} {{ place }}',
      '{{ greeting }} {{ preposition }} {{ place }}',
      '{{ greeting }} {{ preposition }} {{ noun }}',
      '{{ adjective }} {{ nouns }} {{ preposition }} {{ place }}',
      '{{ adjective }} {{ place }}',
      '{{ mod }} {{ name }} {{ preposition }} {{ place }}',
      '{{ mod }} {{ name }} {{ preposition }} {{ nouns }}',
      '{{ adjective }} {{ mod }} {{ name }}'
    ]
    let titleTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];;
    return titleTemplate;
  }
  
  getPlace() {
    let option = this.randInt(1,3);
    let place;
    switch(option) {
      case 1:
        place = this.fakerator.address.country();
        break;
      case 2:
        place = this.fakerator.address.city();
        break;
      default:
        place = this.fakerator.address.streetName();
    }
    return place;
  }
  
  getName() {
    let option = this.randInt(1,3);
    let name;
    switch(option) {
      case 1:
        name = this.fakerator.names.firstName()
        break;
      case 2:
        name = this.fakerator.names.lastName()
        break;
      default:
        name = this.fakerator.names.firstName() + ' ' + fakerator.names.lastName();
    }
    return name;
  }
  
  getGreeting() {
    let greetings = [
      'farewell',
      'welcome',
      'lament'
    ];
    let greeting;
    greeting = greetings[Math.floor(Math.random() * greetings.length)];;
    return greeting;
  }
  
  getPreposition() {
    let prepositions = [ "above", "absent", "across", "after", "against", "along", "around", "as", "aside", "astride", "at", "atop", "barring", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "by", "despite", "down", "during", "failing", "following", "for", "from", "given", "in", "inside", "into", "like", "midst", "near", "of", "off", "on", "onto", "opposite", "outside", "over", "past", "round", "since", "than", "through", "throughout", "till", "times", "to", "toward", "towards", "under", "underneath", "unlike", "until", "unto", "up", "upon", "versus", "with", "within", "without" ];
    let preposition;
    preposition = prepositions[Math.floor(Math.random() * prepositions.length)];;
    return preposition;
  }
  
  getMod() {
    let mods = ['young','good','old','bad','late','poor','small','big','royal','ambitious','courageous','petulant','obtuse'];
    let mod = " ";
    if (this.randBool()) {
      mod = mods[Math.floor(Math.random() * mods.length)];
    }
    return mod;
  }
  
  titleCase(str) {
    let blacklist = [ 'of', 'a', 'an', 'at', 'from', 'on', 'to', 'up', 'by', 'in', 'so' ];
    let string = str.replace(/ {1,}/g," ");
    return string.toLowerCase().split(' ').map(function(word,index) {
      if ((blacklist.indexOf(word) !== -1) && (index > 0)) {
        return word;
      } else if (typeof word[0] !== 'undefined') {
        return word.replace(word[0], word[0].toUpperCase());
      } else {
        if (word != ' ') {
          return word;
        }
      }
    }).join(' ');
  }

  randInt(min, max) {
    let int;
    min = Math.ceil(min);
    max = Math.floor(max);
    int = Math.floor(Math.random() * (max - min + 1)) + min;
    return int;
  }

  randBool(odds) {
    let bool;
    if (odds == undefined) {
      bool = Math.random() >= 0.5;
    } else {
      bool = Math.random() <= (odds / 100);
    }
    return bool;
  }
  
}

module.exports = Artist;