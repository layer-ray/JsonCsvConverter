import jsonToCsv from './jsonToCsv';
import csvToJson from './csvToJson';

import './index.css'

const loadCSV_btn = document.querySelector('#csv-loader');
const loadJSON_btn = document.querySelector('#json-loader');
const displayCSV_textarea = document.querySelector('#csv-area');
const displayJSON_textarea = document.querySelector('#json-area');

function handleFileload(e){
    let area, mimeTypes;

    if(e.target.id === 'csv-loader'){
        area = displayCSV_textarea;
        mimeTypes = ['text/csv', 'text/tsv'];
    } else {
        area = displayJSON_textarea;
        mimeTypes = ['application/json'];
    }

    const file = e.target.files[0];
    const reader = new FileReader();

    console.log(escape(file.name));
    console.log(escape(file.size));
    console.log(escape(file.type));

    reader.onload = evt => {
        area.innerHTML = evt.target.result;
    }
    if(!mimeTypes.includes(file.type)) {
        console.log('file not supported!');
        return;
    }
    reader.readAsText(file)
}

loadCSV_btn.addEventListener('change', handleFileload);
loadJSON_btn.addEventListener('change', handleFileload);