

function viewModel(){
    var _this = this;
    this.events = ko.observableArray();
    
    this.eventsFiltered = ko.computed(function(){
        var innerEvents = _this.events();
        
        innerEvents = _(innerEvents).filter(function(e){
            try{
            return _this.filterFn().call(e);
            }catch(ex){
                console.log(ex);
                return false;
            }
        });
        return innerEvents;
    })
    
    this.eventsExpanded = ko.computed(function(){
        return _this.eventsFiltered().map(function(e){
           return {date: e.date, data: expandProps(e.data) }; 
        });
    });
    
    $.getJSON('data', function(data){
        var innerEvents = data.events.map(function(e){
            return {date: new Date(e.date), data: e.data };
        });
        var sortedEvents = _(innerEvents).sortBy(function(evt){
           return evt.date;
        }).reverse();
        
        _this.events(sortedEvents);
    });
    
    this.filterString = ko.observable("");
    this.filterFn = ko.computed(function(){
        if(_this.filterString() === "")
            return function(){return true;};
        
        return new Function("return " + "function () { var data = this.data; var date = this.date; return " + preprocess(_this.filterString()) + "; }")();
    })
    
    this.mapString = ko.observable("");
    this.reduceString = ko.observable("");
};

$(function(){
    ko.applyBindings(new viewModel());
})

function preprocess(str){
    return str.replace("==", "=").replace("=", "==");
}

function expandProps(obj){
    var res = [];
    for(var propertyName in obj) {
        
        var val = obj[propertyName];
        
        if(val instanceof Array)
            val = val.map(function(item){
                if(typeof item !== "string" && typeof item !== "number" && typeof item !== "boolean")
                    return expandProps(item);
                return item;
            });
        
        if(!(val instanceof Array) && typeof val !== "string" && typeof val !== "number" && typeof val !== "boolean")
            val = expandProps(val);//recurse
        
        res.push({name: propertyName, value: val});
    }
    return res;
}