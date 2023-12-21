import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './PokeInfo.css';
import fetcher from '../modules/fetcher.js';

import Stats from '../components/PokeInfo/Stats.jsx';
import Forms from '../components/PokeInfo/Forms.jsx';
import GenderGroup from '../components/PokeInfo/GenderGroup.jsx';
import Evolution from '../components/PokeInfo/Evolution.jsx';
import Moves from '../components/PokeInfo/Moves.jsx';

export default function({data}){
  const navigate = useNavigate();
  const {id} = useParams()
  const [monData,setMonData] = useState({});
  const [monTypes, setMonTypes] = useState(["",""]);
  const [speciesData,setSpeciesData] = useState({});
  const [evoData, setEvoData] = useState({});
  const [portraitLoaded, setPortraitLoaded] = useState("");
  const [tabSelect, setTabSelect] = useState("stats");

  useEffect(()=>{
    const getPokeData = async ()=>{
      try{
        const dataMon = await fetcher(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setMonData(dataMon);
        const dataSpecies = await fetcher(dataMon.species.url);
        setSpeciesData(dataSpecies);
        const dataEvo = await fetcher(dataSpecies.evolution_chain.url);
        setEvoData(dataEvo);
        setMonTypes([dataMon.types[0].type.name, dataMon.types[1]?dataMon.types[1].type.name:dataMon.types[0].type.name]);
      }
      catch(err){
        console.log(err);
      }
    }
    getPokeData();
    setPortraitLoaded("");
  },[id]);
  const urlPattern = /(?<=\/)\d+(?=\/$)/

  const tabUpdate = (e)=>{
    setTabSelect(e.target.value);
  }

  const errorImage = e=>{
    e.target.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesData.id}.png`;
  }

  return(
    <div className="poke-info">
      <div className="portrait-info" style={{background:`linear-gradient(135deg, var(--${monTypes[0]}-type),var(--${monTypes[1]}-type))`}}>
        <p>{monTypes[0]}</p>
        {monTypes[0]!=monTypes[1] &&
        <p className="type-b">{monTypes[1]}</p>
        }
        { monData.id &&
          <img
            className={portraitLoaded}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${monData.id}.png`}
            onLoad={()=>{setPortraitLoaded("portrait-loaded")}}
            onError={errorImage}
          />
        }
      </div>
      <nav>
        <div className="mon-title">
          <button onClick={()=>{navigate("/search")}}>&#10094;</button>
          <h2>{id}</h2>
        </div>
        <form>
            <input id="info-stats" name="poke-info-window" type="radio" value="stats" onChange={tabUpdate} defaultChecked/>
            <label htmlFor="info-stats">Stats</label>
            <input id="info-species" name="poke-info-window" value="species" onChange={tabUpdate} type="radio"/>
            <label htmlFor="info-species">Species</label>
            <input id="info-builder" name="poke-info-window" value="builder" onChange={tabUpdate} type="radio"/>
            <label htmlFor="info-builder">Builder</label>
            <input id="info-moves" name="poke-info-window" value="moves" onChange={tabUpdate} type="radio"/>
            <label htmlFor="info-moves">Moves</label>
        </form>
      </nav>
      {tabSelect=="species" &&
        <>
          <Forms species={speciesData} name={id} data={data}/>
          <Evolution evolution={evoData} name={id} data={data}/>
          <GenderGroup typeData={data.types}type={monData.types} species={speciesData}/>
        </>
      }
      {tabSelect=="stats" &&
        <>
          <Stats data={data} monData={monData}/>
        </>
      }
      {tabSelect=="builder" &&
        <>
          comming soon
        </>
      }
      {tabSelect=="moves" &&
        <>
          <Moves monData={monData} data={data}/>
        </>
      }
    </div>
  )
}
      /*
      */
