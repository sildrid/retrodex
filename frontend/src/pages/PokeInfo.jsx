import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './PokeInfo.css';
export default function(props){
  const navigate = useNavigate();
  const {id} = useParams()
  const [monData,setMonData] = useState({});
  const [speciesData,setSpeciesData] = useState({});
  const [evoData, setEvoData] = useState({});
  let test = false;
  useEffect(()=>{
    const getPokeData = async ()=>{
      try{
        const resMon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const dataMon = await resMon.json();
        setMonData(dataMon);
        console.log(dataMon);
        const resSpecies = await fetch(dataMon.species.url);
        const dataSpecies = await resSpecies.json();
        setSpeciesData(dataSpecies);
        console.log(dataSpecies);
        const resEvo = await fetch(dataSpecies.evolution_chain.url);
        const dataEvo = await resEvo.json();
        console.log(dataEvo);
        console.log(dataEvo.chain.evolves_to[0].species.name)
        setEvoData(dataEvo);
      }
      catch(err){
        console.log(err);
      }
    }
    getPokeData();
  },[]);
  const urlPattern = /(?<=\/)\d+(?=\/$)/

  const evolutionTree = (data)=>{
    return(
      <li>asd</li>
    )
  }



  return(
    <div className="poke-info">
      <nav>
        <div>
          <button onClick={()=>{navigate("/search")}}>&#10094;</button>
          <h2>{id}</h2>
        </div>
        <ul>
          <li>
            <input id="info-forms" name="poke-info-window" type="radio" defaultChecked/>
            <label htmlFor="info-forms">Forms</label>
          </li>
          <li>
            <input id="info-builder" name="poke-info-window" type="radio"/>
            <label htmlFor="info-builder">Builder</label>
          </li>
          <li>
            <input id="info-moves" name="poke-info-window" type="radio"/>
            <label htmlFor="info-moves">Moves</label>
          </li>
          <li>
            <input id="info-misc" name="poke-info-window" type="radio"/>
            <label htmlFor="info-misc">Misc</label>
          </li>
        </ul>
      </nav>
      <div>
        <div>
          <h3>Forms</h3>
          <ul>
            {speciesData.varieties && speciesData.varieties.length>1 && speciesData.varieties.map(n=>{
              const varId = n.pokemon.url.match(urlPattern)[0];
              return(
                <li key={n.pokemon.name} className={n.pokemon.name==monData.name?"active-mon":""}>
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${varId}.png`}/>
                  {n.pokemon.name.split("-").join(" ")}
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <h3>evolutions</h3>
          <ul>
            {evoData.chain &&
              (<>
                <li>{evoData.chain.species.name}</li>
                {evoData.chain.evolves_to.map(n=>{
                  console.log(n)
                  return (<li>meh</li>)
                })}
              </>)
              
            }
            {evolutionTree([evoData.chain])}
          </ul>

        </div>
      </div>
      <ul>weak to</ul>
      <ul>resist</ul>
      <ul>abilities</ul>
      <ul>stat spread</ul>
      <ul>misc</ul>
    </div>
  )
}
