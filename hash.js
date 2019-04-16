let exec = require('child_process').exec;
let seedSetter;
let fs = require('fs');
let indexPath = './public/index.html'
let fd = fs.open(indexPath, 'w',function() {
  seedSetter = callHashFile();
  seedSetter.stdout.on('data', function (data) {
    setSeed(data);
  });
});

function setSeed(hash) {
  let seed = hash.slice(0, 7);
  fs.readFile('./source/index.html', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/{{ hash }}/g, seed);
  
    fs.writeFile(indexPath, result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
}

function callHashFile() {
  return exec('git rev-parse HEAD');
}