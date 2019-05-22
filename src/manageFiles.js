import {
    loaderInput, editorArea,
    metadataInput
} from './domSelections';

import { checkEmbeddedLineTerminators } from './csvToJson';

function handleFileload(e){
    const mimeTypes = ['text/csv', 'text/tsv', 'application/json'];
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = evt => {
        editorArea.value = evt.target.result;
        metadataInput.value = `File name: ${file.name} - File size: ${file.size}`;
        let event = new InputEvent('input')
        editorArea.dispatchEvent(event);
    }

    if(!mimeTypes.includes(file.type)) {
        console.log('file not supported!');
        return;
    }
    reader.readAsText(file)
}

export function saveFile(data, filename, fileFormat = 'csv'){
    if(fileFormat = 'csv') {
        let blob = new Blob([data], {type: "text/csv;charset=utf-8"});
        saveAs(blob, filename + '.csv');
    } else {
        let blob = new Blob([data], {type: "application/json;charset=utf-8"});
        saveAs(blob, filename + '.json');
    }    
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

loaderInput.addEventListener('change', handleFileload);
