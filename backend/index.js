'use strict'
const express = require("express");
const dexCompiler = require("./modules/dexCompiler.js");

const port = 8000;
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// routes
app.get("/api/data", (req,res)=>{
  res.json(dexInfo);
});
app.get("/api/pokemon", (req,res)=>{
  res.json(dexInfo.pokemon);
});
app.get("/api/types", (req,res)=>{
  res.json(dexInfo.types);
});


// dex data builder

let dexInfo = {
  pokemon:[], types:[]
};
const buildData = async ()=>{
  try{
    console.log("Building pokedex data...");
    dexInfo = await dexCompiler();

    // server start

    app.listen(port, ()=>{
      console.log(`Server listening on port ${port}...`);
    })
  }
  catch(err){
    console.log("Failed to build pokedex data", err);
  }
}


// launch server

buildData();
