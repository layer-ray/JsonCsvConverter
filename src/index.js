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

const saveCsvEditorBtn = document.querySelector('#panel-one #save-btn-one');
const saveJsonEditorBtn = document.querySelector('#panel-two #save-btn-two');

const loadCsvBtn = document.querySelector('#panel-one #load-btn-one');
const loadJsonBtn = document.querySelector('#panel-two #load-btn-two');

const loaderCsvInput = document.querySelector('#panel-one #loader-one');
const loaderJsonInput = document.querySelector('#panel-two #loader-two');

const beautifyCsvBtn = document.querySelector('#panel-one #beautify-one');
const beautifyJsonBtn = document.querySelector('#panel-two #beautify-two');

const csvEditorArea = document.querySelector('#panel-one #upper-area-one');
const jsonEditorArea = document.querySelector('#panel-two #upper-area-two');

const closeCsvEditorBtn = document.querySelector('#panel-one #close-upper-area-one');
const closeJsonEditorBtn = document.querySelector('#panel-two #close-upper-area-two');

const csvEditorSplitArea = document.querySelector('#panel-one #split-area-one');
const jsonEditorSplitArea = document.querySelector('#panel-two #split-area-two');

const csvEditorLowerArea = document.querySelector('#panel-one  #lower-area-one');
const jsonEditorLowerArea = document.querySelector('#panel-two #lower-area-two');

const csvEditorLowerWrapperArea = document.querySelector('#panel-one #lower-area-wrapper-one');
const jsonEditorLowerWrapperArea = document.querySelector('#panel-two #lower-area-wrapper-two');

const closeCsvEditorLowerArea = document.querySelector('#panel-one #close-lower-area-one');
const closeJsonEditorLowerArea = document.querySelector('#panel-two #close-lower-area-two');

const csvMetadataInput = document.querySelector('#panel-one #metadata-one');
const jsonMetadataInput = document.querySelector('#panel-two #metadata-two');

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
    toggler.innerHTML = csvToJson ? "csv to json &rlarr;" : "json to csv &rlarr;"
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
        toggler.classList.toggle('hidden');
        
    }


    if(conversionState) {
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
        loadCsvBtn.classList.toggle('disabled');
        beautifyCsvBtn.classList.toggle('hidden');
        removeJsonPanelSplit();
    } else {
        jsonPanel.classList.toggle('inverse');
        csvPanel.classList.toggle('active');
        loadJsonBtn.classList.toggle('disabled');
        beautifyJsonBtn.classList.toggle('hidden');
        removeCsvPanelSplit();
    }
    
    if(conversionState) {
        swapAreasBtn.innerHTML = "&rarrhk; see result";
        splitHBtn.disabled = true;
        splitVBtn.disabled = true;
        conversionState = 0;
    } else {
        swapAreasBtn.innerHTML = "&larrhk; see original";
        splitHBtn.disabled = false;
        splitVBtn.disabled = false;
        conversionState = 1;
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