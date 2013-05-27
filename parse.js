// npm install rem escape-regexp crutch natural
// gem install chronic

var rem = require('rem')
  , fs = require('fs')
  , exec = require('child_process').exec
  , escape = require('escape-regexp')
  , chronic = require('crutch').parse
  , natural = require('natural')
  , NGrams = natural.NGrams

var samples = fs.readFileSync('./sample.txt', 'utf8').split('\n').filter(String).map(JSON.parse);

// function identifyRanges (str, next) {
//   str = str.replace(/(\b(at\b\s*)\d+(:\d+)?\s*([ap]m)?\s*([-–—]+|\bto\b)\s*\d+(:\d+)?\s*([ap]m)?\b)/ig, '<TIMERANGE>$1</TIMERANGE>');
//   next(null, str);
// }

function escapeshell (cmd) {
  return '"'+cmd.replace(/(["$`\\])/g,'\\$1')+'"';
};

function identifyTimeWords (str, next) {
  var tokenizer = new natural.WordTokenizer();
  tokenizer.tokenize(str).forEach(function (token) {
    chronic(token, function (err, date, str) {
      if (!err) {
        console.log(err, date, token);
      }
    })
  })
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
  
  // identifyRanges(str, function (err, str) {
    identifyTimeWords(str, function (err, str) {
      identifyHolidays(str, function (err, str) {
        console.log(str);
      })
    });
  // })

  // Make Text Processing request.
  // str = str.replace(/\s+([ap]m)\b/ig, '$1');
  // rem.json('http://text-processing.com/api/phrases/').post('form', {
  //   text: str
  // }, function (err, json) {
  //   console.log(json);
  // });
});