"use strict"

const getAbilityList = async ()=>{
  try{
    console.log("fetching ability list...")
    let nextUrl = "https://pokeapi.co/api/v2/ability/";
    const abilityArr = [];
    const progressMatcher = /(?<=offset=)\d+/;

    while(nextUrl){
      const response = await fetch(nextUrl);
      const data = await response.json();
      for(let i=0; i<data.results.length; i++){
        const abilityName = data.results[i].name;
        const res = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
        const abilityInfo = await res.json();
        const effect = abilityInfo.effect_entries.find(n=>{
          return n.language.name === "en";
        }) || {};
        
        abilityArr.push({
          name: abilityName,
          effect: effect.short_effect
        });
      }
      const progress = nextUrl.match(progressMatcher);
      console.log(`fetching abilities... ${Math.floor(progress / data.count * 100)}%`);
      nextUrl = data.next;
    };
    return abilityArr;
  }
  catch(err){
    console.log("error:", err);
    return [];
  }
}


/////////////////////////////////////////////////

const getType = async (typeUrl)=>{
  try{
    const response = await fetch(typeUrl);
    const data = await response.json();
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
      class: data.move_damage_class ? data.move_damage_class.name : "unkown",
      weakTo: data.damage_relations.double_damage_from.map(n=>n.name),
      resists: data.damage_relations.half_damage_from.map(n=>n.name),
      inmuneTo: data.damage_relations.no_damage_from.map(n=>n.name),
      moves: moveArr,
      pokemon: data.pokemon.map(n=>{
        return {name:n.pokemon.name,slot:n.slot}
      })
    }
    return typeInfo;
  }
  catch(err){
    console.log(`failed to fetch ${typeUrl}`, err);
    return {}
  }
}


/////////////////////////////////////////////////

const getTypeList = async ()=>{
  try{
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    const data = await response.json();

    const typeData = [];

    for(let i=0; i<data.count; i++){
      const type = await getType(data.results[i].url);
      console.log(`fetching type data... ${Math.floor(i / data.count * 100)}%`)
      typeData.push(type);
    }
    console.log("finished fetching type data");
    return typeData;
  }
  catch(err){
    console.log(err);
    return null;
  }
}


/////////////////////////////////////////////////

const idMatcher = /(?<=\/)\d+(?=\/)/;
const progressMatcher = /(?<=offset=)\d+/;
const getPokemon = async (targetUrl)=>{
  try{
    const response = await fetch(targetUrl);
    const data = await response.json();
    const dexEntries = data.results.map(mon =>{
      const entry = {
        id: mon.url.match(idMatcher)[0],
        name: mon.name,
      }
      return entry;
    });
    const progress = targetUrl.match(progressMatcher);
    return {
      entries: dexEntries,
      next: data.next,
      progress: progress ? Math.floor(progress[0] / data.count * 100) : 0
    };
  }
  catch(err){
    console.log("failed to fetch pokemon data", err);
    return {};
  }
}


/////////////////////////////////////////////////

const getPokemonList = async ()=>{
  try{
    const pokemonList = [];
    let nextUrl = "https://pokeapi.co/api/v2/pokemon/?limit=100";
    while(nextUrl){
      const pokemon = await getPokemon(nextUrl);
      console.log(`fetching pokemon data ${pokemon.progress}%...`)
      pokemonList.push(...pokemon.entries)
      nextUrl = pokemon.next;
    }
    console.log("finished fetching pokemon data...")
    return pokemonList;
  }
  catch(err){
    console.log("error building pokemon list", err);
    return [];
  }
}

/////////////////////////////////////////////////

const dexCompiler = async (targetUrl) =>{
  try{
    const abilities = await getAbilityList();
    const types = await getTypeList();
    const pokemonList = await getPokemonList();

    console.log("compiling data...")
    const pokemon = pokemonList.map(mon =>{
      const monTypes = types.filter(type =>{
        const monSearch = type.pokemon.find(n => n.name === mon.name);
        return !!monSearch;
      });
      const entryType = [];
      monTypes.forEach(type =>{
        const monSlot = type.pokemon.find(n => n.name === mon.name).slot;
        entryType[monSlot-1] = type.name;
      });
      return {name: mon.name,id: mon.id, type: entryType};
    })

    types.forEach(n=>delete n.pokemon);
    console.log("finished compiling data!");
    return {types, pokemon, abilities};
  }
  catch(err){
    console.log("error compiling dex data", err)
    return null;
  }
}


module.exports = dexCompiler;
