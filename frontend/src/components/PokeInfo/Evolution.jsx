import {useNavigate} from 'react-router-dom';
import './Evolution.css';

export default function({evolution}){
  const navigate = useNavigate();
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
    switch(info.trigger.name){
      case "level-up":
        return(
          <div>
            <p>Lv Up</p>
            {requirements.map(n=>{
              switch(n){
                case "min_level":
                  return <p>Lv{info.min_level}+</p>
                break;
                case "min_happiness":
                case "min_affection":
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
                case "time_of_day":
                  return <p>{info.time_of_day}</p>
                break;
                case "location":
                  return <p>special location</p>
                break;
                case "known_move":
                  return <p>knowing {info.known_move.name}</p>
                break;
                case "known_move_type":
                  return <p>knowing {info.known_move_type.name} type move</p>
                break;
                case "min_beauty":
                  return <p>high beauty</p>
                break;
                case "relative_physical_stats":
                  return <p>Atk{info.relative_physical_stats>0?">":"<"}Def</p>
                break;
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
                default:
                  return <p>{clearText(n)}</p>
                break;
              }
            })}
          </div>
        );
      break;
      case "use-item":
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
      case "trade":
        return(
          <p>
            trade<br/>
            {info.held_item && clearText(info.held_item.name)}<br/>
            {info.held_item && <img
              className="evo-item"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${info.held_item.name}.png`}
            />}
          </p>)
      break;
      default:
        return clearText(info.trigger.name);
      break;
    }
  }

  const evolutionTree = (entry, babyItem)=>{
    const idMatcher = /(?<=\/)\d+(?=\/)/;
    return(
      <>
        {entry &&
          <li
            className="evo-container"
            key={entry.species.name}
          >
            <div className="evo-wrapper" onClick={()=>{
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
                <img className="evo-portrait" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.species.url.match(idMatcher)[0]}.png`}/>
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
