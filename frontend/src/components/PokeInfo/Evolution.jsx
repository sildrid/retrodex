import {useNavigate} from 'react-router-dom';
import './Evolution.css';

export default function({evolution, name}){
  const navigate = useNavigate();
  const idMatcher = /(?<=\/)\d+(?=\/)/;
  const clearText = (txt)=>{
    return txt.replace(/[-_]/g," ");
  }
  const evoDetails = (info)=>{
    const requirements = Object.keys(info).filter(key=>{
      if(info[key] && key!="trigger"){
        return true;
      }else{
        return false;
      }
    })
    const triggerReturn = ()=>{
      switch(info.trigger.name){
        case "level-up":
          return <p>Lv Up</p>
        break;
        default:
          return clearText(info.trigger.name)
        break;
      }
    }
    return(
      <div>
        {triggerReturn()}
        {requirements.map(n=>{
          switch(n){
            case "gender":
              return <p>{info.gender?"female":"male"}</p>
            break;
            case "held_item":
              return( 
                <p>
                  {clearText(info.held_item.name)}<br/>
                  <img
                    className="evo-item"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${info.held_item.name}.png`}
                  />
                </p>
              )
            break;
            case "item":
              return(
                <p>
                  {clearText(info.item.name)}<br/>
                  <img
                    className="evo-item"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${info.item.name}.png`}
                  />
                </p>
              )
            break;
            case "known_move":
              return <p>knowing {info.known_move.name}</p>
            break;
            case "known_move_type":
              return <p>knowing {info.known_move_type.name} type move</p>
            break;
            case "location":
              return <p>special location</p>
            break;
            case "min_affection":
            case "min_happiness":
              return (
                <p>
                  happy<br/>
                  <img
                    className="evo-item"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soothe-bell.png"
                   />
                </p>
              )
            break;
            case "min_beauty":
              return <p>high beauty</p>
            break;
            case "min_level":
              return <p>Lv{info.min_level}+</p>
            break;
            case "party_species":
              return(
                <p>
                  <img className="evo-item" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${info.party_species.url.match(idMatcher)[0]}.png`}/>
                  <br/>
                  {info.party_species.name} in the party
                </p>
              )
            break;
            case "party_type":
              return <p>{info.party_type.name} type party</p>
            break;
            case "relative_physical_stats":
              return <p>Atk{info.relative_physical_stats>0?">":"<"}Def</p>
            break;
            case "time_of_day":
              return <p>{info.time_of_day}</p>
            break;
            case "trade_species":
              return(
                <p>
                  with
                  <br/>
                  <img className="evo-item" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${info.trade_species.url.match(idMatcher)[0]}.png`}/>
                  <br/>
                  {info.trade_species.name}
                </p>
              )
            break;
            default:
              return <p>{clearText(n)}</p>
            break;
          }
        })}
      </div>
    )
  }

  const evolutionTree = (entry, babyItem)=>{
    return(
      <>
        {entry &&
          <li
            className="evo-container"
            key={entry.species.name}
          >
            <div className={`evo-wrapper${entry.species.name==name?" active-evo":""}`} onClick={()=>{
              document.querySelector(".dex-screen").scrollTo({top: 0, behavior: 'smooth'});
              navigate(`/pokemon/${entry.species.name}`);
            }}>
              <div className="evo-detail">
                {!!entry.evolution_details.length &&
                  <div>
                    {evoDetails(entry.evolution_details[0])}
                  </div>
                }
                {!!babyItem &&
                  <div>
                    {clearText(babyItem.name)+" (Baby)"}
                    <img className="evo-item" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${babyItem.name}.png`}/>
                  </div>
                }
                {
                  !babyItem && !entry.evolution_details.length &&
                  <div></div>
                }
                <img className="evo-portrait" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.species.url.match(idMatcher)[0]}.png`}/>
                {
                  !babyItem && !entry.evolution_details.length &&
                  <div></div>
                }
              </div>
              <h3>{entry.species.name}</h3>
            </div>
            <ul>
              {entry.evolves_to.map(evoData=>{
                return evolutionTree(evoData);
              })}
            </ul>
          </li>
        }
      </>
    )
  }
  return(
      <div className="evo-list">
        <h2>evolutions</h2>
        <ul>
          {evolutionTree(evolution.chain, evolution.baby_trigger_item)}
        </ul>
      </div>
  )
}
