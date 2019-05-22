import {
    pageContainer, togglerBtn, displayOptions, 
    swapAreasBtn, splitHBtn, splitVBtn, convertBtn, 
    csvPanel, jsonPanel, saveCsvEditorBtn, 
    saveJsonEditorBtn, loadCsvBtn, loadJsonBtn, 
    loaderCsvInput, loaderJsonInput, beautifyCsvBtn, 
    beautifyJsonBtn, csvEditorArea, jsonEditorArea, 
    closeCsvEditorBtn, closeJsonEditorBtn, 
    csvEditorSplitArea, jsonEditorSplitArea, 
    csvEditorLowerArea, jsonEditorLowerArea, 
    csvEditorLowerWrapperArea, jsonEditorLowerWrapperArea, 
    closeCsvEditorLowerArea, closeJsonEditorLowerArea, 
    csvMetadataInput, jsonMetadataInput
} from './domSelections';

import { checkEmbeddedLineTerminators } from './csvToJson';

export function handleFileload(e){
    let area, metadata, mimeTypes;

    if(e.target.id === 'loader-one'){
        area = csvEditorArea;
        metadata = csvMetadataInput;
        mimeTypes = ['text/csv', 'text/tsv'];
    } else {
        area = jsonEditorArea;
        metadata = jsonMetadataInput;
        mimeTypes = ['application/json'];
    }

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = evt => {
        area.value = evt.target.result;
        metadata.value = `File name: ${file.name} - File size: ${file.size}`;
    }

    if(!mimeTypes.includes(file.type)) {
        console.log('file not supported!');
        return;
    }
    reader.readAsText(file)
}

function prettyPrintCsv(){
    const rawCsv = csvEditorArea.value;
    const cleanCsv = padFields(rawCsv, ',');
    csvEditorArea.value = cleanCsv;
};

function prettyPrintJson(){
    const rawJson = jsonEditorArea.value;
    const cleanJson = JSON.stringify(JSON.parse(rawJson), undefined, 2);
    jsonEditorArea.value = cleanJson;
};

function padFields(tabledString, delimiter, pad=" "){
    
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



loaderCsvInput.addEventListener('change', handleFileload);
loaderJsonInput.addEventListener('change', handleFileload);

beautifyCsvBtn.addEventListener('click', prettyPrintCsv); 
beautifyJsonBtn.addEventListener('click', prettyPrintJson);