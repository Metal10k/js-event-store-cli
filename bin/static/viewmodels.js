

function viewModel(){
    var _this = this;
    this.events = ko.observableArray();
    
    this.eventsFiltered = ko.computed(function(){
        var innerEvents = _this.events();
        
        innerEvents = _(innerEvents).filter(function(e){
            try{
            return _this.filterFn()(e); //_this.filterFn().call(e);
            }catch(ex){
                console.log(ex);
                return false;
            }
        });
        return innerEvents;
    });
    
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
        
        return new Function("return " + "function (item) { var data = item.data; var date = item.date; return " + preprocess(_this.filterString()) + "; }")();
    })
    
    this.mapString = ko.observable("");
    this.mapFn = ko.computed(function(){
        if(_this.mapString() === "")
            return function(item){return item;};
        
        return new Function("return " + "function (item) { var data = item.data; var date = item.date; return " + preprocess(_this.mapString()) + "; }")();
    })
    
    this.reduceString = ko.observable("");
    this.reduceFn = ko.computed(function(){
        return new Function("return " + "function (item, acc) {  return " + preprocess(_this.reduceString()) + "; }")();
    });
    
    this.eventsProcessedFull = ko.computed(function(){
        var mapped = _this.eventsFiltered().map(function(e){
            try{
                return _this.mapFn()(e);
            }catch(ex){
                return null;
            }
        });
        
        if(_this.reduceString() !== "")
            return _(mapped).reduce(function(acc, item){
                try{
                    return _this.reduceFn()(acc, item);
                }catch(ex){
                    return acc;
                }
            });
        return mapped;
    });
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