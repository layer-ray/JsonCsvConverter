export default function main(data, delimiter=',', firstlineHeader=false)
{

    let rows = data.split('\n');
    let keys, values;

    try {
        let cleanRows = checkEmbeddedLineTerminators(rows);
        let result = validateCSV(cleanRows, delimiter);
        // It generates a default key name if the header is not provided
        if(firstlineHeader){
            keys = result[0];
            values = result.slice(1);
        } else {
            keys = result[0].map((_, idx) => 'key_' + (+idx+1))
            values = result;
        }
    } catch(err){
        console.log('Something went wrong.\n', err.message);
        return;
    }

    // build json from csv cleaned data
    let resultJson = [];
    for (const fields of values) {
        let tmp = {};
        for(let i=0; i<fields.length; i++){
            // remove unnecessary double quotes 
            let currentKey = keys[i].replace(/"/g, "");
            let currentValue;
            if(currentValue === ""){
                currentValue = null
            } else {
                currentValue = fields[i].replace(/"/g, "").trim();
            }
            tmp[currentKey] = currentValue;
        };
        resultJson.push(tmp);
    };

    return resultJson;
}

// Check if all rows have the same amount of fields
// set null unset values
function validateCSV(csvArray, del) {
    // Extract the number of fields of the first row
    let atomicFirstLineFields = csvArray[0].split(del);
    let splittedRowsArray = [checkEmbeddedLineTerminators(atomicFirstLineFields)];

    let max_fields = splittedRowsArray[0].length;
    let log = [];

    // compare the number of fields of each row 
    for (let i=1; i < csvArray.length; i++) {
        let atomicFields = csvArray[i].split(del);
        let fields = checkEmbeddedLineTerminators(atomicFields);

        splittedRowsArray.push(fields);

        // if fields are different from the max_fields stores a 
        // log message and (possibly) update the max_fields var
        if (fields.length !== max_fields) {
            log.push(`row_${i+1}: Different number of fields detected at line ${i+1} (other_rows_current_max_fields: ${max_fields}, own_fields: ${fields.length})`);

            if(fields.length > max_fields) {
                max_fields = fields.length;
            };
        };
    };

    if(Object.keys(log).length !== 0) {
        throw Error(JSON.stringify(log));
    }

    return splittedRowsArray;
};

// function used to check if a field has like breaks inside it
export function checkEmbeddedLineTerminators(rows) {

    let rowArr = rows.slice();
    let totalQuotes = 0;

    for (let row of rowArr){
        let numQuotes = countCharInString("\"", row);
        totalQuotes += numQuotes.length;
    };

    // If the total number of double quotes is odd the file is not valid
    if(totalQuotes % 2 === 1 ){
        throw Error('Odd number of quotes detected. Please check the provided file.')
    };

    let crippledRows = [];
    do {
        let newRow = [];
        // empty array that host indexes of uncomplete rows each loop cycle
        crippledRows = [];

        // loop through all the lines counting the double-quotes occurrences
        for (let i=0; i < rowArr.length; i++){
            let numQuotes = countCharInString("\"", rowArr[i]);
            totalQuotes += numQuotes.length;
            // if number of double quotes is odd means that
            // the row does not include a complete record
            if(numQuotes.length %2 === 1){
                crippledRows.push(i);
                console.log('inline terminator detected:', i);
            };
        };

        if(crippledRows.length !== 0) {
            // creates a new row combining the first line with odd number of 
            // double quotes with the subsequent in the main array
            newRow = rowArr[crippledRows[0]].concat(rowArr[+crippledRows[0] +1 ]);

            // remove the two uncomplete lines and add the new one
            rowArr.splice(crippledRows[0], 2, newRow);
        }
        
    } while(crippledRows.length !== 0)

    return rowArr;
};

function countCharInString(char, str, start=0){
    let occurrences = [];
    let ix = str.indexOf(char, start);
    
    // if char if found in str starts a loop looking
    // for the char starting the search one char after
    // the first one found
    while(ix !== -1) {
        occurrences.push(ix);
        ix = str.indexOf(char, ix + 1);
    }
    
    return occurrences;
};

