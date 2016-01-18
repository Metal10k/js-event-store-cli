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
    }
}