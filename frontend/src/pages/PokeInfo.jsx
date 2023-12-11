import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './PokeInfo.css';
import fetcher from '../modules/fetcher.js';
import Forms from '../components/PokeInfo/Forms.jsx';
import TypeGenderGroup from '../components/PokeInfo/TypeGenderGroup.jsx';
import Evolution from '../components/PokeInfo/Evolution.jsx';

export default function({data}){
  const navigate = useNavigate();
  const {id} = useParams()
  const [monData,setMonData] = useState({});
  const [monTypes, setMonTypes] = useState(["",""]);
  const [speciesData,setSpeciesData] = useState({});
  const [evoData, setEvoData] = useState({});
  const [portraitLoaded, setPortraitLoaded] = useState("");

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


  return(
    <div className="poke-info">
      <div className="portrait-info" style={{background:`linear-gradient(135deg, var(--${monTypes[0]}-type),var(--${monTypes[1]}-type))`}}>
        <p>{monTypes[0]}</p>
        {monTypes[0]!=monTypes[1] &&
        <p className="type-b">{monTypes[1]}</p>
        }
        <img
          className={portraitLoaded}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${monData.id}.png`}
          onLoad={()=>{setPortraitLoaded("portrait-loaded")}}
        />
      </div>
      <nav>
        <div>
          <button onClick={()=>{navigate("/search")}}>&#10094;</button>
          <h2>{id}</h2>
        </div>
        <ul>
          <li>
            <input id="info-misc" name="poke-info-window" type="radio" defaultChecked/>
            <label htmlFor="info-misc">Misc</label>
          </li>
          <li>
            <input id="info-forms" name="poke-info-window" type="radio"/>
            <label htmlFor="info-forms">Species</label>
          </li>
          <li>
            <input id="info-builder" name="poke-info-window" type="radio"/>
            <label htmlFor="info-builder">Builder</label>
          </li>
          <li>
            <input id="info-moves" name="poke-info-window" type="radio"/>
            <label htmlFor="info-moves">Moves</label>
          </li>
        </ul>
      </nav>

      <Forms species={speciesData} name={id}/>
      <Evolution evolution={evoData} name={id}/>
      <TypeGenderGroup typeData={data.types}type={monData.types} species={speciesData}/>
    </div>
  )
}
