var jsonfile = require("jsonfile");
var file = 'db.json';

module.exports = {
    get: function(){

        var db = {}
        try{
            var db = jsonfile.readFileSync(file) ;
        }
        catch(ex){}

        if(!db.events)
            db.events = [];
        return db;
    },
    set: function(db){
        jsonfile.writeFile(file, db, {spaces: 2}, function(err) {
        if(err)
            console.error(err);
        })
    }
}