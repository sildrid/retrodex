'use strict'
const express = require('express');
const path = require('path');
const {updateAbilities,updateTypes,updatePokemon} = require('./modules/dexCompiler.js');
const {loadJson,writeJson} = require('./modules/fileSystem.js');

const port = 3000;
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//public
app.use('/', express.static(path.join(__dirname,'public')));

//app.use('/', express.static(path.join(__dirname,'public')));

// routes
app.get("/api/data", (req,res)=>{
  res.json(dexData);
});
app.get("/api/pokemon", (req,res)=>{
  res.json(dexData.pokemon);
});
app.get("/api/types", (req,res)=>{
  res.json(dexData.types);
});
app.use('*', express.static(path.join(__dirname,'public/index.html')));


// dex data builder

let dexData = {};
const launchServer = async()=>{
  dexData = await loadJson();
  app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
  })
  checkDexData()
}

const checkDexData = async (targetUrl) =>{
  console.log("checking pokedex data");
  try{
    const timeUp = Date.now()-8.64e+7;
    if(dexData.modAbilities>timeUp){
      console.log("abilities are up to date...");
    }else{
      const abilities = await updateAbilities();
      if(abilities.length){
        dexData.abilities = abilities;
        dexData.modAbilities = Date.now();
        writeJson(dexData);
      }
    }
    if(dexData.modTypes>timeUp){
      console.log("type data is up to date...")
    }else{
      const types = await updateTypes();
      if(types.length){
        dexData.types = types;
        dexData.modTypes = Date.now();
        writeJson(dexData);
      }
    }
    if(dexData.modAbilities>timeUp && dexData.modTypes>timeUp){
      if(dexData.modPokemon>timeUp){
        console.log("pokemon data is up to date...");
      }else{
        const pokemonList = await updatePokemon();
        console.log("compiling dex data...");
        const pokemon = pokemonList.map(mon=>{
          const monTypes = dexData.types.filter(type=>{
            const monSearch = type.pokemon.find(n=>n.name === mon.name);
            return !!monSearch;
          });
          const entryType = [];
          monTypes.forEach(type=>{
            const monSlot = type.pokemon.find(n=>n.name === mon.name).slot;
            entryType[monSlot-1] = type.name;
          });
          return {
            name: mon.name,
            id: mon.id,
            type: entryType
          }
        });
        if(pokemon.length){
          dexData.pokemon = pokemon;
          dexData.modPokemon = Date.now();
          writeJson(dexData)
        }
      }
    }
    //const pokemonList = await getPokemonList();

    //console.log("Compiling data...")
    //const pokemon = pokemonList.map(mon =>{
    //  const monTypes = types.filter(type =>{
    //    const monSearch = type.pokemon.find(n => n.name === mon.name);
    //    return !!monSearch;
    //  });
    //  const entryType = [];
    //  monTypes.forEach(type =>{
    //    const monSlot = type.pokemon.find(n => n.name === mon.name).slot;
    //    entryType[monSlot-1] = type.name;
    //  });
    //  return {
    //    name: mon.name,
    //    id: mon.id,
    //    type: entryType
    //  };
    //})

    //types.forEach(n=>delete n.pokemon);
    //console.log("Finished compiling data!");
    //return {types, pokemon, abilities};
  }
  catch(err){
    console.log("Error compiling dex data", err);
    return null;
  }
}

/////////////////////////////////////////////////
launchServer();
