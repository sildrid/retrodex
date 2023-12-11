'use strict'

const {writeFile, readFile} = require('fs/promises');
const {resolve} = require('path');
const {Buffer} = require('buffer');

/////////////////////////////////////////////////
const jsonPath = './data/dex.json';


/////////////////////////////////////////////////

const filePath = resolve(jsonPath);
const loadJson = async()=>{
  let fileObj = {};
  try{
    const contents = await readFile(filePath, {encoding: 'utf8'});
    fileObj = JSON.parse(contents);
  }
  catch(err){
    console.log(`file "${jsonPath}" not found...`);
  }
  return fileObj;
}

const writeJson = async(obj)=>{
  try{
    const jsonString = JSON.stringify(obj);
    const data = new Uint8Array(Buffer.from(jsonString));
    const promise = writeFile(filePath,data)

    await promise;
  }
  catch(err){
    console.error(err);
  }
  console.log("write file end...")
}

module.exports = {writeJson, loadJson};
