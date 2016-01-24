function transposeInput(input){
    if(input === "true" || input === "True" || input === "TRUE")
        return true;
    else if(input === "false" || input === "False" || input === "FALSE")
        return false;
    return input;
}

module.exports = {
   parse : function(inputs){ //string[]
        var data = inputs.map(function(input){
            var splitItems = input.split(":");
            
            if(splitItems.length > 2)
                return {key: splitItems[0], values: splitItems.slice(1)}
            if(splitItems.length === 2)
                return {key: splitItems[0], value: splitItems[1]}
            
            return {key: splitItems[0]}
        })

        var dataAsObj = data.reduce(function(acc, item){
        if(item.values)
                acc[item.key] = item.values;   
        else if(item.value)
                acc[item.key] = item.value; 
        else
                acc[item.key] = true;
        return acc;
        }, {});
        
        return dataAsObj;
    },
    parseFilters: function(inputs){ //string[]
        var data = inputs.map(function(input){
            var clauses = input.split("&");
            return clauses.map(function(clause){
               var s = clause.split("=");
               var left = s[0];
               var right = s[1];
               return function(input){
                   //console.log(input);
                   var data = input.data;
                   if(!data)
                        return false;
                   
                //    console.log("record for :" + JSON.stringify(input));
                    //console.log(transposeInput(data[left]));
                //    console.log(right);
                    //console.log(transposeInput(data[left]) == right);
                    
                   if(!right)
                       if(data[left])
                            return true;
                       else
                            return false
                    
                   return data[left] == transposeInput(right);
               }
            }).reduce(function(acc, item){
                return function(input){
                    //console.log(input);
                    //console.log(item(input));
                    return acc(input) && item(input);
                };
            }, function(input){return true;});
        }).reduce(function(acc, item){
                return function(input){
                    //console.log(input);
                    return acc(input) && item(input);
                };
            }, function(input){return true;});
        return data;
    }
}