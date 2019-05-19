import jsonToCsv from './jsonToCsv';
import csvToJson from './csvToJson';

import './index.css'

const CSVPanel = document.querySelector('.left-panel');
const loadCSV_btn = document.querySelector('#csv-loader');
const displayCSV_textarea = document.querySelector('#csv-area');
const CSVMetadata_input = document.querySelector('#csv-metadata');

const JSONPanel = document.querySelector('.right-panel');
const loadJSON_btn = document.querySelector('#json-loader');
const displayJSON_textarea = document.querySelector('#json-area');
const JSONMetadata_input = document.querySelector('#json-metadata');

const indentation_btn = document.querySelector('#indentation');
const toggler_btn = document.querySelector('#toggler');
const convert_btn = document.querySelector('#convert-btn');
const clear_btn = document.querySelector('#clear');

let currentConversion = 1; // 0 - json to csv, 1 -csv to json

function handleFileload(e){
    let area, metadata, mimeTypes;

    if(e.target.id === 'csv-loader'){
        area = displayCSV_textarea;
        metadata = CSVMetadata_input;
        mimeTypes = ['text/csv', 'text/tsv'];
    } else {
        area = displayJSON_textarea;
        metadata = JSONMetadata_input;
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

// Paul sasik [STACK OVERFLOW]
function prettyPrint(){
    const rawJson = displayJSON_textarea.value;
    const cleanJson = JSON.stringify(JSON.parse(rawJson), undefined, 2);
    displayJSON_textarea.value = cleanJson;
};

function clear(){
    clearCsv();
    clearJson();
}

function clearCsv(){
    displayCSV_textarea.value = "";
    CSVMetadata_input.value = "";
}

function clearJson(){
    displayJSON_textarea.value = "";
    JSONMetadata_input.value = "";
}

function toggleConversion(){
    if(currentConversion) {
        currentConversion = 0;
        JSONPanel.classList.add("active");
        loadJSON_btn.disabled = false;
        displayJSON_textarea.disabled = false;
        CSVPanel.classList.remove("active");
        loadCSV_btn.disabled = true;
        displayCSV_textarea.disabled = true;
        toggler_btn.innerText =  "JSON to CSV (click to toggle)"
    } else {
        currentConversion = 1;
        CSVPanel.classList.add("active");
        loadCSV_btn.disabled = false;
        displayCSV_textarea.disabled = false;
        JSONPanel.classList.remove("active");
        loadJSON_btn.disabled = true;
        displayJSON_textarea.disabled = true;
        toggler_btn.innerText =  "CSV to JSON (click to toggle)"
    }
}


loadCSV_btn.addEventListener('change', handleFileload);
loadJSON_btn.addEventListener('change', handleFileload);

indentation_btn.addEventListener('click', prettyPrint);
toggler_btn.addEventListener('click', toggleConversion);
clear_btn.addEventListener('click', clear);