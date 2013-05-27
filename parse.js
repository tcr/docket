// npm install rem escape-regexp

var rem = require('rem')
  , fs = require('fs')
  , exec = require('child_process').exec
  , escape = require('escape-regexp');

var samples = fs.readFileSync('./sample.txt', 'utf8').split('\n').filter(String).map(JSON.parse);

function identifyRanges (str, next) {
  str = str.replace(/(\b(at\b\s*)\d+(:\d+)?\s*([ap]m)?\s*([-–—]+|\bto\b)\s*\d+(:\d+)?\s*([ap]m)?\b)/ig, '<TIMERANGE>$1</TIMERANGE>');
  next(null, str);
}

function escapeshell (cmd) {
  return '"'+cmd.replace(/(["$`\\])/g,'\\$1')+'"';
};

function identifyPhrases (str, next) {
  exec('python timex.py ' + escapeshell(str), function (err, stdout, stderr) {
    next(err, stdout);
  });
}

function identifyHolidays (str, next) {
  var holidays = ['memorial day'];
  next(null, holidays.reduce(function (str, cur) {
    return str.replace(new RegExp('\\b(' + escape(cur) + ')\\b', 'gi'), '<HOLIDAY>$1</HOLIDAY>');
  }, str));
}

samples.forEach(function (sample) {
  var str = sample.input;
  str.replace(/\s+/g, ' ');

  // Remove whitespace between numbers and times
  
  identifyRanges(str, function (err, str) {
    identifyPhrases(str, function (err, str) {
      identifyHolidays(str, function (err, str) {
        console.log(str);
      })
    });
  })

  // Make Text Processing request.
  // str = str.replace(/\s+([ap]m)\b/ig, '$1');
  // rem.json('http://text-processing.com/api/phrases/').post('form', {
  //   text: str
  // }, function (err, json) {
  //   console.log(json);
  // });
});