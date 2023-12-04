import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './PokeInfo.css';
import fetcher from '../modules/fetcher.js';
import Forms from '../components/PokeInfo/Forms.jsx';
import Evolution from '../components/PokeInfo/Evolution.jsx';

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
        const dataMon = await fetcher(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setMonData(dataMon);
        const dataSpecies = await fetcher(dataMon.species.url);
        setSpeciesData(dataSpecies);
        const dataEvo = await fetcher(dataSpecies.evolution_chain.url);
        setEvoData(dataEvo);
      }
      catch(err){
        console.log(err);
      }
    }
    getPokeData();
  },[id]);
  const urlPattern = /(?<=\/)\d+(?=\/$)/


  return(
    <div className="poke-info">
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
      <ul>weak to</ul>
      <ul>resist</ul>
      <ul>abilities</ul>
      <ul>stat spread</ul>
      <ul>misc</ul>
    </div>
  )
}
