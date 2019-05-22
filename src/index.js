import convertJsonToCsv from './jsonToCsv';
import convertCsvToJson from './csvToJson';

import './index.css';
import {prettyPrint, saveFile} from './manageFiles';

import {
    pageContainer, togglerBtn, displayOptions, 
    swapAreasBtn, splitHBtn, splitVBtn, panel, 
    saveEditorBtn, loadBtn, loadTitleSpan, 
    loaderInput, beautifyBtn, editorArea, 
    closeEditorBtn, editorSplitArea, editorLowerArea, 
    editorLowerWrapperArea, closeEditorLowerArea, 
    metadataInput, convertBtn
} from './domSelections';

let csvToJson = true; 
let conversionState = 0;
let original, result = "";

function reverse(){
    csvToJson = !csvToJson;
    editorArea.value = "";
    metadataInput.value = "";
    loaderInput.value = null;
    convertBtn.disabled = true;
    saveEditorBtn.disabled = true;
    loadTitleSpan.innerText = csvToJson ? "LOAD CSV" : "LOAD JSON";
    toggler.innerHTML = csvToJson ? "csv to json <span>&rlarr;</span>" : "json to csv <span>&rlarr;</span>"
};

function beautify(){
    editorArea.value = csvToJson
                        ? prettyPrint(editorArea.value, 'csv')
                        : prettyPrint(editorArea.value, 'json');
};

function convert(){    
    panel.classList.toggle('inverse');
    closeEditorBtn.classList.toggle('hidden');
    metadataInput.value = "";
    loaderInput.value = null;
    original = editorLowerArea.value = editorArea.value;

    displayOptions.classList.toggle('hidden');
    convertBtn.classList.toggle('hidden');
    toggler.classList.toggle('hidden');

    if(conversionState) {
        editorArea.value = "";
        metadataInput.value = "";
        editorLowerArea.value = "";
        convertBtn.disabled = true;

        conversionState = 0;
    } else {
        convertFile();
        conversionState = 1;
    }
};

function convertFile(){
    saveEditorBtn.disabled = editorArea.value === "";
    if(csvToJson ) {
        let parsed = convertCsvToJson(original, ',', false)
        result = editorArea.value = JSON.stringify(parsed, undefined, 2);

    } else {
        let parsed = convertJsonToCsv(editorArea.value, ',', true)
        result = editorArea.value = parsed;
    }
}

function save(){
    
}

function isAreaEmpty(e){
    convertBtn.disabled = e.target.value === "";
    saveEditorBtn.disabled = e.target.value === "";
};

function swapResultOriginal(){    
    panel.classList.toggle('inverse');
    loadBtn.classList.toggle('disabled');
    beautifyBtn.classList.toggle('hidden');
    closeEditorBtn.classList.toggle('hidden');

    if(conversionState) {
        editorArea.value = original;
        swapAreasBtn.innerHTML = "&rarrhk; see result";
        splitHBtn.disabled = true;
        splitVBtn.disabled = true;
        conversionState = 0;
    } else {
        editorArea.value = result;
        swapAreasBtn.innerHTML = "&larrhk; see original";
        splitHBtn.disabled = false;
        splitVBtn.disabled = false;
        conversionState = 1;
    }
};


function splitAreaVertically(){
    // code area already splitted horizontally
    if(editorSplitArea.classList.contains('h')) {
        editorSplitArea.classList.remove('h')
    } else {
        editorLowerWrapperArea.classList.toggle('hidden');
    }
};

function splitAreaHorizontally(){
        // code area already splitted vertically
        if(!editorLowerWrapperArea.classList.contains('hidden') &&
          !editorSplitArea.classList.contains('h')) {
            editorSplitArea.classList.add('h');
        } else {
            editorSplitArea.classList.toggle('h');
            editorLowerWrapperArea.classList.toggle('hidden');
        }
};

function removePanelSplit(){
    editorSplitArea.classList.remove('h');
    editorLowerWrapperArea.classList.add('hidden');
}

togglerBtn.addEventListener('click', reverse);
beautifyBtn.addEventListener('click', beautify);
convertBtn.addEventListener('click', convert);

editorArea.addEventListener('input', isAreaEmpty);
swapAreasBtn.addEventListener('click', swapResultOriginal);
closeEditorBtn.addEventListener('click', convert);

splitVBtn.addEventListener('click', splitAreaVertically);
splitHBtn.addEventListener('click', splitAreaHorizontally);

closeEditorLowerArea.addEventListener('click', removePanelSplit);