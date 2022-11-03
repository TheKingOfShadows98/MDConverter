
// PATHS
const inputFolder = './docs/input';
const outputFolder =  './docs/output';
const tamplatePath = './docs/template.html';

// FILE SISTEM
const fs = require('fs');
const fsp = require('fs').promises

// MD CONVERTER
const showdown  = require('showdown');
const converter = new showdown.Converter();

// jsdom
const jsdom = require("jsdom");

async function start(){
    
    // LOAD TEMPLATE AS STRING
    let plainT = await fsp.readFile(tamplatePath, 'utf8');

    // READ ANY FILE IN INPUTFOLDER
    fs.readdir(inputFolder, (err, files) => {
        // foreach function
        files.forEach(file => {
            // set PathFile
            let path = (inputFolder +'/'+ file);
            //Read currentFile
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                // set output path
                let outpath = outputFolder +'/'+ file;
                // convert md to html
                let info = convert(data);
                // insert content in the template
                let result = addTemplate(plainT , info);
                // create html file
                write(outpath , result, file);
            });
        });
    });
}

// ADDING A HTML TEMPLATE
function addTemplate(plainT , data, name = ''){
    let names = name.split('.');

    // create a JSDOM with a template
    let template = new jsdom.JSDOM(plainT);
    template.window.document.getElementById('web-title').innerText = names[0];
    // insert data into html
    template.window.document.getElementById('body').innerHTML = data;
    // return html string structure
    return template.window.document.documentElement.outerHTML;
}

// get data in md, and return html string
function convert (data){
    let html = converter.makeHtml(data);
    return html;
}

// write file as .html
function write (file, data){
    //split to erase .md
    let files = file.split('.');
    // reset path with .html extension
    let path = '.' + files[1] + '.html';
    //write file with path , and data
    fs.writeFile(path, data, err => {
        if (err) {
          console.error(err);
          return;
        }
        // log confirmation
        console.log(path, 'making succesfully');
      });
}

//start aplication
start();
