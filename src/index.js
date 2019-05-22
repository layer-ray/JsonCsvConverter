import convertJsonToCsv from './jsonToCsv';
import convertCsvToJson from './csvToJson';

import './index.css';
import './index1024.css';
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
import { handleFileLoad } from './manageFiles';

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

            let parsed = convertCsvToJson(csvEditorArea.value, ',', false);
            jsonEditorArea.value = JSON.stringify(parsed, undefined, 2);
            jsonEditorLowerArea.value = csvEditorArea.value;
        } else {
            jsonPanel.classList.toggle('inverse');
            csvPanel.classList.toggle('active');
            closeCsvEditorBtn.classList.toggle('hidden');
            saveCsvEditorBtn.disabled = csvEditorArea.value === "";

            csvEditorArea.value  = convertJsonToCsv(jsonEditorArea.value, ',');
            csvEditorLowerArea.value = jsonEditorArea.value;
        }
 
        displayOptions.classList.toggle('hidden');
        convertBtn.classList.toggle('hidden');
        toggler.classList.toggle('hidden');
    }


    if(conversionState) {
        csvEditorArea.value = "";
        jsonEditorArea.value = "";
        csvMetadataInput.value = "";
        jsonMetadataInput.value = "";

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

jsonEditorArea.addEventListener('input', checkIfEmpty);
csvEditorArea.addEventListener('input', checkIfEmpty);

togglerBtn.addEventListener('click', reverse);
convertBtn.addEventListener('click', convert);

swapAreasBtn.addEventListener('click', swapResultOriginal);

closeJsonEditorBtn.addEventListener('click', convert);
closeCsvEditorBtn.addEventListener('click', convert);

splitVBtn.addEventListener('click', splitAreaVertically);
splitHBtn.addEventListener('click', splitAreaHorizontally);

closeCsvEditorLowerArea.addEventListener('click', removeCsvPanelSplit);
closeJsonEditorLowerArea.addEventListener('click', removeJsonPanelSplit);