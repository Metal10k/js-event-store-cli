var argv = require('yargs').argv;
var parser = require('./lib/parser');
var db = require('./lib/db');
    
var inputs = argv._;  


var obj = parser.parse(inputs);

var store = db.get();
store.events.push({date: new Date(),  data: obj});
db.set(store);
