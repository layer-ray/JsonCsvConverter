import convertJsonToCsv from './jsonToCsv';
import convertCsvToJson from './csvToJson';

import './index.css';
import './index1024.css';

const csvPanel = document.querySelector('#panel-one');
const jsonPanel = document.querySelector('#panel-two');
const togglerBtn = document.querySelector('#toggler');

const displayOptions = document.querySelector('#header-options');
const swapAreasBtn = document.querySelector('#swap-areas');
const splitHBtn = document.querySelector('#split-h');
const splitVBtn = document.querySelector('#split-v');

const pageContainer = document.querySelector('#main-container');

const saveCsvEditorBtn = document.querySelector('#panel-one #save-btn');
const saveJsonEditorBtn = document.querySelector('#panel-two #save-btn');

const loadCsvBtn = document.querySelector('#panel-one #load-btn');
const loadJsonBtn = document.querySelector('#panel-two #load-btn');

const beautifyCsvBtn = document.querySelector('#panel-one #beautify');
const beautifyJsonBtn = document.querySelector('#panel-two #beautify');

const csvEditorArea = document.querySelector('#panel-one #upper-area');
const jsonEditorArea = document.querySelector('#panel-two #upper-area');

const closeCsvEditorBtn = document.querySelector('#panel-one #close-upper-area');
const closeJsonEditorBtn = document.querySelector('#panel-two #close-upper-area');

const csvEditorSplitArea = document.querySelector('#panel-one .split-area');
const jsonEditorSplitArea = document.querySelector('#panel-two .split-area');

const csvEditorLowerArea = document.querySelector('#panel-one  #lower-area');
const jsonEditorLowerArea = document.querySelector('#panel-two #lower-area');

const csvEditorLowerWrapperArea = document.querySelector('#panel-one #lower-area-wrapper');
const jsonEditorLowerWrapperArea = document.querySelector('#panel-two #lower-area-wrapper');

const closeCsvEditorLowerArea = document.querySelector('#panel-one #close-lower-area');
const closeJsonEditorLowerArea = document.querySelector('#panel-two #close-lower-area');

const csvMetadataInput = document.querySelector('#panel-one #metadata');
const jsonMetadataInput = document.querySelector('#panel-two #metadata');

const convertBtn = document.querySelector('#convert-btn');


let csvToJson = true; 
let conversionState = 0;
/* 
class inverse change flex flow AND column position
class active change ONLY column position
 */
function reverse(){
    csvToJson = !csvToJson;
    csvPanel.classList.toggle('inverse');
    jsonPanel.classList.toggle('inverse');
    csvEditorArea.value = "";
    jsonEditorArea.value = "";
};

function convert(){
    if(window.innerWidth < 1024) {
        if(csvToJson) {
            csvPanel.classList.toggle('inverse');
            jsonPanel.classList.toggle('active');
            closeJsonEditorBtn.classList.toggle('hidden');
            saveJsonEditorBtn.disabled = jsonEditorArea.value === "";
        } else {
            jsonPanel.classList.toggle('inverse');
            csvPanel.classList.toggle('active');
            closeCsvEditorBtn.classList.toggle('hidden');
            saveCsvEditorBtn.disabled = csvEditorArea.value === "";
        }
 
        displayOptions.classList.toggle('hidden');
        convertBtn.classList.toggle('hidden');
        toggler.disabled = !toggler.disabled;
    }


    if(conversionState === 1) {
        csvToJson
            ?   resetJsonPanel()
            :   resetCsvPanel();
        conversionState = 0;
    } else {
        conversionState = 1;
    }
};

function swapResultOriginal(){
    if(csvToJson) {
        csvPanel.classList.toggle('inverse');
        jsonPanel.classList.toggle('active');
        removeJsonPanelSplit();
    } else {
        jsonPanel.classList.toggle('inverse');
        csvPanel.classList.toggle('active');
        removeCsvPanelSplit();
    }
};

function splitAreaVertically(){
    if(csvToJson) {
        if(jsonEditorSplitArea.classList.contains('h')) {
            jsonEditorSplitArea.classList.remove('h')
        } else {
            jsonEditorLowerWrapperArea.classList.toggle('hidden');
        }
    } else {
        if(csvEditorSplitArea.classList.contains('h')) {
            csvEditorSplitArea.classList.remove('h')
        } else {
            csvEditorLowerWrapperArea.classList.toggle('hidden');
        }
    }
};

function splitAreaHorizontally(){
    if(csvToJson) {
        // code area already splitted vertically
        if(!jsonEditorLowerWrapperArea.classList.contains('hidden') &&
          !jsonEditorSplitArea.classList.contains('h')) {
            jsonEditorSplitArea.classList.add('h');
        } else {
            jsonEditorSplitArea.classList.toggle('h');
            jsonEditorLowerWrapperArea.classList.toggle('hidden');
        }
    } else {
        // code area already splitted vertically
        if(!csvEditorLowerWrapperArea.classList.contains('hidden') &&
          !csvEditorSplitArea.classList.contains('h')) {
            csvEditorSplitArea.classList.add('h');
        } else {
            csvEditorSplitArea.classList.toggle('h');
            csvEditorLowerWrapperArea.classList.toggle('hidden');
        }
    }
};

function checkIfEmpty(e){
    if(csvToJson) {
        saveJsonEditorBtn.disabled = e.target.value === "";
    } else {
        saveCsvEditorBtn.disabled = e.target.value === "";
    }

};

function resetJsonPanel(){
    jsonEditorArea.value = "";
    removeCsvPanelSplit();
}

function resetCsvPanel(){
    csvEditorArea.value = "";
    removeCsvPanelSplit();
}

function removeJsonPanelSplit(){
    jsonEditorSplitArea.classList.remove('h');
    jsonEditorLowerWrapperArea.classList.add('hidden');
}

function removeCsvPanelSplit(){
    csvEditorSplitArea.classList.remove('h');
    csvEditorLowerWrapperArea.classList.add('hidden');
}


function checkVal(){
    console.log(isAreaEmpty);
};

jsonEditorArea.addEventListener('input', checkIfEmpty);
csvEditorArea.addEventListener('input', checkIfEmpty);

beautifyJsonBtn.addEventListener('click', checkVal)
beautifyCsvBtn.addEventListener('click', checkVal);

togglerBtn.addEventListener('click', reverse);
convertBtn.addEventListener('click', convert);

swapAreasBtn.addEventListener('click', swapResultOriginal);

closeJsonEditorBtn.addEventListener('click', convert);
closeCsvEditorBtn.addEventListener('click', convert);

splitVBtn.addEventListener('click', splitAreaVertically);
splitHBtn.addEventListener('click', splitAreaHorizontally);

closeCsvEditorLowerArea.addEventListener('click', removeCsvPanelSplit);
closeJsonEditorLowerArea.addEventListener('click', removeJsonPanelSplit);