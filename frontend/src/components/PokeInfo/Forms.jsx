import {useNavigate} from 'react-router-dom';
import './Forms.css';
export default function({species, name, data}){
  const navigate = useNavigate();
  const clearText = (txt)=>{
    return txt.replace(/[-_]/g," ");
  }
  const errorSprite = e=>{
    e.target.src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.id}.png`;
  }
  return(
    <div className="forms-list">
      <h2>Forms</h2>
      <ul>
        {species.varieties && species.varieties.map(entry=>{
          const findMon = data.pokemon ?
            data.pokemon.find(n=>n.name==entry.pokemon.name):
            {};
          const mon = findMon ? findMon : {};
          return(
            <li
              onClick={()=>{
                document.querySelector(".dex-screen").scrollTo({top: 0, behavior: 'smooth'});
                navigate(`/pokemon/${entry.pokemon.name}`);
              }}
              key={mon.id}
              className={name==entry.pokemon.name?"active-form":""}
            >
              <div className="form-type">
                {mon.type &&
                  <>
                    <h4 className={mon.type[0]+"-bg"}>{mon.type[0]}</h4>
                    {mon.type.length>1 &&
                      <h4 className={mon.type[1]+"-bg"}>{mon.type[1]}</h4>
                    }
                  </>
                }
              </div>
              <img
                className="form-portrait"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mon.id}.png`}
                onError={errorSprite}
              />
              <h3>{clearText(entry.pokemon.name)}</h3>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
/*
          <li key={"mon"+mon.id} onClick={()=>{navigate(`/pokemon/${mon.name}`)}}>
            <h4>nº{mon.id<1000?mon.id:"-"}</h4>
            <img
              loading="lazy"
              alt={mon.name}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mon.id}.png`}
              onLoad={e=>e.target.classList.add("img-loaded")}
            />
            <div>
              {mon.type.map((type,i)=><p key={i} className={type+"-bg"}>{type}</p>)}
            </div>
            <h3>{mon.name}</h3>
          </li>
*/
