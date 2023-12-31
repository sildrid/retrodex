import {useNavigate} from 'react-router-dom';
import './Evolution.css';

export default function({evolution, name, data}){
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
        {requirements.map((n,i)=>{
          switch(n){
            case "gender":
              return <p key={i}>{info.gender?"female":"male"}</p>
            break;
            case "held_item":
              return( 
                <p key={i}>
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
                <p key={i}>
                  {clearText(info.item.name)}<br/>
                  <img
                    className="evo-item"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${info.item.name}.png`}
                  />
                </p>
              )
            break;
            case "known_move":
              return <p key={i}>knowing {info.known_move.name}</p>
            break;
            case "known_move_type":
              return <p key={i}>knowing {info.known_move_type.name} type move</p>
            break;
            case "location":
              return <p key={i}>special location</p>
            break;
            case "min_affection":
            case "min_happiness":
              return (
                <p key={i}>
                  happy<br/>
                  <img
                    className="evo-item"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soothe-bell.png"
                   />
                </p>
              )
            break;
            case "min_beauty":
              return <p key={i}>high beauty</p>
            break;
            case "min_level":
              return <p key={i}>Lv{info.min_level}+</p>
            break;
            case "party_species":
              return(
                <p key={i}>
                  <img className="evo-item" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${info.party_species.url.match(idMatcher)[0]}.png`}/>
                  <br/>
                  {info.party_species.name} in the party
                </p>
              )
            break;
            case "party_type":
              return <p key={i}>{info.party_type.name} type party</p>
            break;
            case "relative_physical_stats":
              return <p key={i}>Atk{info.relative_physical_stats>0?">":"<"}Def</p>
            break;
            case "time_of_day":
              return <p key={i}>{info.time_of_day}</p>
            break;
            case "trade_species":
              return(
                <p key={i}>
                  with
                  <br/>
                  <img className="evo-item" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${info.trade_species.url.match(idMatcher)[0]}.png`}/>
                  <br/>
                  {info.trade_species.name}
                </p>
              )
            break;
            default:
              return <p key={i}>{clearText(n)}</p>
            break;
          }
        })}
      </div>
    )
  }
  const evolutionTree = (key,entry, babyItem)=>{
    const findMon = entry && data.pokemon ? data.pokemon.find(n=> n.name==entry.species.name): null;
    const mon = findMon ? findMon : {};
    return(
      <>
        {entry &&
          <li className="evo-wrapper">
            <div
              className={`evo-container${mon.name==name?" active-evo":""}`}
              onClick={()=>{
                document.querySelector(".dex-screen").scrollTo({top: 0, behavior: 'smooth'});
                navigate(`/pokemon/${mon.name}`);
              }}
              key={mon.name+key}
            >
            <div className="evo-type">
              {mon.type &&
                  <>
                    <h4 className={mon.type[0]+"-bg"}>{mon.type[0]}</h4>
                    {mon.type.length>1 &&
                      <h4 className={mon.type[1]+"-bg"}>{mon.type[1]}</h4>
                    }
                  </>
              }
            </div>
              <div className="evo-detail">
                {!!entry.evolution_details.length &&
                  <div className="evo-how">
                    {evoDetails(entry.evolution_details[0])}
                  </div>
                }
                {!!babyItem &&
                  <div className="evo-how">
                    {clearText(babyItem.name)+" (Baby)"}
                    <img className="evo-item" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${babyItem.name}.png`}/>
                  </div>
                }
                <img className="evo-portrait" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.species.url.match(idMatcher)[0]}.png`}/>
              </div>
            <h3>{entry.species.name}</h3>
            </div>
            {!!entry.evolves_to.length &&
              <ul className="evo-to">
                {entry.evolves_to.map(evoData=>{
                  return evolutionTree(key+1,evoData);
                })}
              </ul>
            }
          </li>
        }
      </>
    )
  }
  return(
    <div className="evo-list">
      <h2>evolutions</h2>
      <ul className="evo-tree">
        {evolutionTree(0, evolution.chain, evolution.baby_trigger_item)}
      </ul>
    </div>
  )
}
