'use strict'
export default function main(data, delimiter=',', firstLineHeader=true){
    let providedJson = JSON.parse(data);
    // Code works with array methods so it convert the provided json if it is not
    let jsonArray = Array.isArray(providedJson) ? providedJson : [providedJson];

    try {
        /* 
        - find all the keys present in the json objects
        - set each missing key on each json to null value
            */
        jsonArray = normalizeJSONKeys(jsonArray);
        for (let i=0; i<jsonArray.length; i++) {
            // check json field to be valid as csv field
            jsonArray[i] = normalizeJSONValues(jsonArray[i], delimiter);
        };
    } catch(e){
        console.log('something failed', e);
        return;
    };
    
    let finalCsv = [];
    let headerKeys = Object.keys(jsonArray[0]);
    // creates the header with the keys of the normalized json
    if(firstLineHeader) {
        let header = headerKeys.join(delimiter);
        finalCsv.push(header);
    }

    for(let record of jsonArray) {
        let entries = Object.entries(record);
        let orderedEntries = [];
        
        // for each record sort the values to match the header
        for (let key of headerKeys){
            orderedEntries.push(entries.find(entry => key === entry[0])[1])
        }
        let newRow = Object.values(orderedEntries).join(delimiter);
        finalCsv.push(newRow);
    }

    return finalCsv.join('\n');
}

function normalizeJSONKeys(jsonArr){
    
    let currentJsonKeys = [];
    let totalKeys = new Set();

    // add all keys of all json to the set
    jsonArr.forEach(json => {        
        currentJsonKeys = Object.keys(json);
        for (let key of currentJsonKeys) {
            if(!totalKeys.has(key)) {
                totalKeys.add(key);
            }
        }
    });
    
    let normalizedJSON = [...jsonArr];

    // add to all json objects the fields they are missing
    totalKeys.forEach(key => {
        normalizedJSON.forEach(json => {
            if(json[key] === undefined){
                json[key] = null
            }
        });
    });

    return normalizedJSON;
};

function normalizeJSONValues(jsonObj, del){
    let entries = Object.entries(jsonObj);
    
    let error = null;
    // check all fields of all json objects
    for (let entry of entries) {
        // first-level array ( allowed if not array of objects)
        if (Array.isArray(entry[1])){
            for (let element of entry[1]) {
                if (isObject(element)) {
                    error = "Nested JSON are not allowed"
                    break;
                };
                
                if(element.toString().indexOf("\"") !== -1) {
                    jsonObj[entry[0][element]] = element.toString().replace(/"/g, "\"\"")
                };
            };
        }; 

        if( isObject(entry[1])) {
            error = "Nested JSON are not allowed"
            break;
        };

        // replace each double quote char with two double quotes chars
        // as per csv spec
        if(entry[1] && entry[1].toString().indexOf("\"") !== -1) {
            jsonObj[entry[0]] = entry[1].toString().replace(/"/g, "\"\"")
        };

        // enclose each entry that contains the delimiter between 
        // double quotes as per csv spec
        // enclose also entries with line terminator character to 
        // let them  be recognizable 
        if(entry[1] && ((entry[1].toString().indexOf(del)  !== -1 ) ||
                        (entry[1].toString().indexOf('\r') !== -1 ) ||
                        (entry[1].toString().indexOf('\n') !== -1 ))){
                jsonObj[entry[0]] = `"${entry[1].toString()}"`
        };
    };

    if(error) throw new Error(error);

    return jsonObj;
};

function isObject(el){
    if(!el) return false;
    return el.constructor === Object;
};