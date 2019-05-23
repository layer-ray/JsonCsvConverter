import {
    loaderInput, editorArea,
    metadataInput
} from './domSelections';

import { checkEmbeddedLineTerminators } from './csvToJson';

export function loadFile(file, ext = "csv", cb){
    const reader = new FileReader();
    let mimeTypes = ext === "csv" 
            ?   ['text/csv', 'text/tsv']
            :   ['application/json'];

    reader.onload = evt => {
        cb({
            data: evt.target.result,
            metadata: {
                // remove extension
                name: file.name.substring(0,file.name.lastIndexOf('.')),
                size: file.size
            }
        });
    };

    if(!mimeTypes.includes(file.type)) {
        console.log('file not supported!');
        return;
    }
    reader.readAsText(file)
}

export function saveFile(data, filename, fileFormat = 'csv'){
    let type = fileFormat === 'csv'
                ? "text/csv;charset=utf-8"
                : "application/json;charset=utf-8"
          
    let blob = new Blob([data], { type });
    saveAs(blob, `${filename}.${fileFormat}`);
};

export function prettyPrint(input, fileFormat = "csv"){
    let parsed;

    if(fileFormat === 'csv') {
        parsed = padFields(input, ',');
    } else {
        parsed = JSON.stringify(JSON.parse(input), undefined, 2);
    };

    return parsed;
};

function padFields(tabledString, delimiter=',', pad=" "){
    
    let cleanArr = checkEmbeddedLineTerminators(tabledString.split('\n'));
    let maxLength = 0;
    for(let row of cleanArr){
        let fieldsArr = row.split(delimiter);
        for(let field of fieldsArr){
            if(field.length > maxLength) {
                maxLength = field.length;
            };
        };
    };

    let newArr = []

    for(let row of cleanArr){
        let fieldsArr = row.split(delimiter);
        for(let i=0; i<fieldsArr.length;i++) {
            if(fieldsArr[i].length > maxLength) {
                maxLength = fieldsArr[i].length;
            };
            
            fieldsArr[i] = fieldsArr[i] + pad.repeat(maxLength - fieldsArr[i].length);
        };
        newArr.push(fieldsArr.join(delimiter));
    };
    
    return newArr.join("\n");
};

