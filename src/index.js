import convertJsonToCsv from './jsonToCsv';
import convertCsvToJson from './csvToJson';

import './index.css';
import {prettyPrint, loadFile, fetchFile, saveFile} from './manageFiles';

import {
    pageContainer, togglerBtn, displayOptions, 
    swapAreasBtn, splitHBtn, splitVBtn, panel, 
    saveBtn, loadBtn, loadTitleSpan, 
    loaderInput, beautifyBtn, editorArea, 
    closeEditorBtn, editorSplitArea, editorLowerArea, 
    editorLowerWrapperArea, closeEditorLowerArea, 
    metadataInput, convertBtn, notification,
    closeNotificationBtn, notificationBody,
    notificationTitle, metadataWrapper,
    metadataLabel, delimiterInput, firstLineBox,
    commands
} from './domSelections';

//initial file format
let iff = "csv";
// final file format
let eff = "json";

// ui shows 'load panel' (0) or 'save panel' (1)
let conversionState = 0;
let original, fileMetadata="", result = "";

// on refresh mozilla do not empty text values
editorArea.value = "";
metadataInput.value = "";

// Toggle between conversion modes (csvToJson / jsonToCsv)
function reverse(){
    iff = iff === "json" ? "csv" : "json";
    eff = eff === "json" ? "csv" : "json";
    editorArea.value = "";
    metadataInput.value = "";
    loaderInput.value = null;
    convertBtn.disabled = true;
    saveBtn.disabled = true;
    loadTitleSpan.innerText = `SELECT ${iff.toUpperCase()} FILE`;
    saveBtn.innerText = `SAVE ${eff.toUpperCase()}`
    toggler.innerHTML = `${iff} to ${eff} <span>&rlarr;</span>`
};

function beautify(){
    try {
        editorArea.value = prettyPrint(editorArea.value, iff);
    } catch (err) {
        let displayedMessage = err.message.startsWith('JSON.parse')
                                ? err.message.replace('JSON.parse: ','')
                                : err.message;
        displayNotification(`Error - invalid ${iff}`, displayedMessage, 'error');
        return;
    }
};

function convert(){    
    // If conversion state = 1 ui has been converted (along with the file)
    // This allow to use the same function to 'convert' ui
    // back to its original state and reset the content
    original = editorLowerArea.value = editorArea.value;
    try {
        if(conversionState) {
            editorArea.value = "";
            metadataInput.value = "";
            metadataInput.disabled = true;
            metadataLabel.innerText = 'Metadata:'
            editorLowerArea.value = "";
            convertBtn.disabled = true;
            removePanelSplit();

            conversionState = 0;
        } else {
            convertFile();
            displayNotification(`Conversion successful!`, "", 'success', true);
            metadataInput.value = `${fileMetadata.name}.${eff}`;
            metadataInput.disabled = false;
            metadataLabel.innerText = 'Save file as:'
            conversionState = 1;
        }
    } catch(err){
        let displayedMessage = err.message.startsWith('JSON.parse')
                                ? err.message.replace('JSON.parse: ','')
                                : err.message;
        displayNotification(`Error - invalid ${iff}`, displayedMessage, 'error');
        return;
    }
    
    panel.classList.toggle('inverse');
    panel.classList.toggle('stretch');
    closeEditorBtn.classList.toggle('hidden');
    loaderInput.value = null;
    
    displayOptions.classList.toggle('hidden');
    toggler.classList.toggle('hidden');
};

function convertFile(){
    saveBtn.disabled = editorArea.value === "";
    let delimiter = delimiterInput.value;
    let head = firstLineBox.checked;
        if(iff === "csv") {
            let parsed = convertCsvToJson(original, delimiter,  head)
            result = editorArea.value = JSON.stringify(parsed, undefined, 2);
        } else {
            let parsed = convertJsonToCsv(editorArea.value, delimiter,  head)
            result = editorArea.value = parsed;
        }

}

function load(e){
    loadFile(e.target.files[0], iff, (err, content) => {
        if(err) {
            displayNotification(`Error`, err.message, 'error');
            throw Error();
        }

        editorArea.value = content.data;
        fileMetadata = content.metadata;
        metadataInput.value = `
        File name: ${content.metadata.name}  - File size: ${content.metadata.size} bytes`
        
        let event = new InputEvent('input')
        editorArea.dispatchEvent(event);
    });  
};

function save(){
    saveFile(result, metadataInput.value, eff);
}

// get pasted text to display its size
function getMetadataFromText(e){
    let pastedText = e.clipboardData.getData('text/plain');
    fileMetadata = {
        name: 'myFile',
        size: pastedText.length
    }
    metadataInput.value = `
        File name: ${fileMetadata.name}  - File size: approx. ${fileMetadata.size} bytes
    `
}

function isAreaEmpty(e){
    convertBtn.disabled = e.target.value === "";
    saveBtn.disabled = e.target.value === "";
};

// Once conversion is done you can look back at the original file
function swapResultOriginal(){
    panel.classList.toggle('inverse');
    loadBtn.classList.toggle('hidden');
    beautifyBtn.classList.toggle('hidden');
    closeEditorBtn.classList.toggle('hidden');
    metadataWrapper.classList.toggle('hidden');
    commands.classList.toggle('hidden');

    if(conversionState) {
        editorArea.value = original;
        removePanelSplit();
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

function displayNotification(title, message, type="error", tmp=false){
    notificationTitle.innerText = title;
    notificationBody.innerText = message;
    notification.classList.remove('exit');
    notification.classList.remove('fade-out');
    notification.classList.remove('error');
    notification.classList.remove('success');
    notification.classList.add(type);
    if(tmp) {
        notification.classList.add('fade-in');
        setTimeout(() => {
            notification.classList.remove('fade-in');
            notification.classList.add('fade-out');
        }, 1000);
    } else {
        notification.classList.remove('tmp');
        notification.classList.remove('exit');
        notification.classList.add('enter');
    }
}

function closeNotification(){    
       notification.classList.remove('enter');
       notification.classList.add('exit');
}

togglerBtn.addEventListener('click', reverse);
beautifyBtn.addEventListener('click', beautify);
convertBtn.addEventListener('click', convert);

editorArea.addEventListener('input', isAreaEmpty);
editorArea.addEventListener('paste', getMetadataFromText);
swapAreasBtn.addEventListener('click', swapResultOriginal);
closeEditorBtn.addEventListener('click', convert);

splitVBtn.addEventListener('click', splitAreaVertically);
splitHBtn.addEventListener('click', splitAreaHorizontally);

closeEditorLowerArea.addEventListener('click', removePanelSplit);


loaderInput.addEventListener('change', load);
saveBtn.addEventListener('click', save);

closeNotificationBtn.addEventListener('click', closeNotification);