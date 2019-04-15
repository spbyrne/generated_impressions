var exec = require('child_process').exec;
var seedSetter = callHashFile();
var fs = require('fs');

function setSeed(hash) {
  let seed = hash.slice(0, 7);
  fs.readFile('./source/index.html', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/{{ hash }}/g, seed);
  
    fs.writeFile('./public/index.html', result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
}

function callHashFile() {
  return exec('git rev-parse HEAD');
}

seedSetter.stdout.on('data', function (data) {
  setSeed(data);
});