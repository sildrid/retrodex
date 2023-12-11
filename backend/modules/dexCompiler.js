"use strict"

const drawProgress = (current,max)=>{
  const pct = Math.floor(current / max * 100);
  const barSize = Math.floor(pct/5);
//  process.stdout.moveCursor(0,-1);
//  process.stdout.clearLine(1);
  console.log(`[${"*".repeat(barSize) + " ".repeat(20 - barSize)}] ${pct}%`);
}

const fetcher = async (url, retries)=>{
  let data = null;
  if(!retries){
    retries = 3;
  }
  try{
    retries--;
    const response = await fetch(url);
    data = await response.json();
  }
  catch(err){
    if(retries>0){
      console.log(`Failed to fetch data`);
      console.log(err.cause);
      data = await fetcher(url, retries)
    }else{
      console.log(`Failed to fetch data`);
      console.log(err.cause.error);
    }
  }
  return data;
}

/////////////////////////////////////////////////

const updateAbilities = async ()=>{
  try{
    console.log("Fetching abilities...\n")
    let nextUrl = "https://pokeapi.co/api/v2/ability/?limit=10";
    const abilityArr = [];
    const progressMatcher = /(?<=offset=)\d+/;

    while(nextUrl){
      const data = await fetcher(nextUrl);
      if(data){
        drawProgress(nextUrl.match(progressMatcher), data.count);
        for(let i=0; i<data.results.length; i++){
          const abilityName = data.results[i].name;
          const abilityInfo = await fetcher(`https://pokeapi.co/api/v2/ability/${abilityName}`);
          const effect = abilityInfo ? abilityInfo.effect_entries.find(n=>{
            return n.language.name === "en";
          }) || {} : {};
          abilityArr.push({
            name: abilityName,
            effect: effect.short_effect
          });
        }
        nextUrl = data.next;
      }else{
        nextUrl = null;
      }
    };
    drawProgress(1,1);
    return abilityArr;
  }
  catch(err){
    console.log(err.cause);
    return [];
  }
}


/////////////////////////////////////////////////

const getType = async (typeUrl)=>{
  try{
    const data = await fetcher(typeUrl);
    const moveArr = [];
    for(let i=0; i<data.moves.length; i++){
      const moveResponse = await fetch(data.moves[i].url);
      const moveData = await moveResponse.json();
      
      const moveEffect = moveData.effect_entries.find(n=>{
        return n.language.name === "en";
      }) || {short_effect:""};
      moveArr.push({
        name: moveData.name,
        accuracy: moveData.accuracy,
        class: moveData.damage_class.name,
        power: moveData.power,
        short_effect: moveEffect.short_effect.replace("$effect_chance", moveData.effect_chance)
      });
    }
    const typeInfo = {
      name: data.name,
      weakTo: data.damage_relations.double_damage_from.map(n=>n.name),
      resists: data.damage_relations.half_damage_from.map(n=>n.name),
      inmuneTo: data.damage_relations.no_damage_from.map(n=>n.name),
      moves: moveArr,
      pokemon: data.pokemon.map(n=>{
        return {
          name:n.pokemon.name,
          slot:n.slot
        }
      })
    }
    return typeInfo;
  }
  catch(err){
    console.log(`Failed to fetch ${typeUrl}`, err);
    return {}
  }
}


/////////////////////////////////////////////////

const updateTypes = async ()=>{
  try{
    console.log("Fetching types...\n");
    drawProgress(0,1);

    const data = await fetcher("https://pokeapi.co/api/v2/type/");
    const typeData = [];

    if(data){
      for(let i=0; i<data.count; i++){
        const type = await getType(data.results[i].url);
        if(type.name!="unknown"){
          drawProgress(i,data.count);
          typeData.push(type);
        }
      }
    }
    drawProgress(1,1);
    console.log("Finished fetching type data");
    return typeData;
  }
  catch(err){
    console.log(err);
    return [];
  }
}


/////////////////////////////////////////////////

const idMatcher = /(?<=\/)\d+(?=\/)/;
const progressMatcher = /(?<=offset=)\d+/;

const getPokemon = async (targetUrl)=>{
  try{
    const data = await fetcher(targetUrl);
    if(data){
      const progress = targetUrl.match(progressMatcher);
      drawProgress(
        progress ? progress[0]:0,
        data.count
      );
      const dexEntries = data.results.map(mon =>{
        const entry = {
          id: mon.url.match(idMatcher)[0],
          name: mon.name,
        }
        return entry;
      });
      return {
        entries: dexEntries,
        next: data.next,
      };
    }else{
      return {
        entries: []
      }
    }
  }
  catch(err){
    console.log("Failed to fetch pokemon data", err);
    return {};
  }
}


/////////////////////////////////////////////////

const updatePokemon = async ()=>{
  try{
    console.log("Fetching pokemon...\n");
    drawProgress(0,1);
    const pokemonList = [];
    let nextUrl = "https://pokeapi.co/api/v2/pokemon/?limit=10";
    while(nextUrl){
      const pokemon = await getPokemon(nextUrl);
      pokemonList.push(...pokemon.entries);
      nextUrl = pokemon.next;
    }
    drawProgress(1,1);
    console.log("Finished fetching pokemon data...");
    return pokemonList;
  }
  catch(err){
    console.log("Error building pokemon list", err);
    return [];
  }
}

/////////////////////////////////////////////////



module.exports = {updateAbilities,updateTypes,updatePokemon};
