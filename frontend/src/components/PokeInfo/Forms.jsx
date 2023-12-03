import {useNavigate} from 'react-router-dom';
import './Forms.css';
export default function({species, name}){
  console.log(species);
  const navigate = useNavigate();
  const clearText = (txt)=>{
    return txt.replace(/[-_]/g," ");
  }
  const errorSprite = e=>{
    e.target.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.id}.png`;
  }
  const idMatcher = /(?<=\/)\d+(?=\/)/;
  return(
    <div className="forms-list">
      <h2>Forms</h2>
      <ul>
        {species.varieties && species.varieties.map(n=>{
          const pokeId = n.pokemon.url.match(idMatcher)[0];
          return(
            <li
              onClick={()=>{navigate(`/pokemon/${n.pokemon.name}`)}}
              key={pokeId}
              className={name==n.pokemon.name?"active-form":""}
            >
              <img
                className="form-portrait"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
                onError={errorSprite}
              />
              <h3>{clearText(n.pokemon.name)}</h3>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
