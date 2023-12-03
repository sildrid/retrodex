import {useEffect} from 'react';
import './Evolution.css';

export default function({species, evolution, name}){

  const evoDetails = (info)=>{
    const txt = info.trigger.name.replace(/-/g," ");
    return txt
  }

  const evolutionTree = (entry)=>{
    console.log(entry)
    const idMatcher = /(?<=\/)\d+(?=\/)/;
    return(
      <>
        {entry &&
          <li>
            <div>
              <div>
                {!!entry.evolution_details.length &&
                  <div>
                    {evoDetails(entry.evolution_details[0])}
                  </div>
                }
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.species.url.match(idMatcher)[0]}.png`}/>
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
  const checkEvo = (entry, arr)=>{
    if(!arr){
      arr = [];
    }
    if(entry){
      if(entry.evolves_to.length){
        const monEvos = entry.evolves_to.map(n=>{
          const details = n.evolution_details[0];
          const evoForm = {
            from: entry.species.name,
            to: n.species.name
          };
          const evoKeys = Object.keys(details).filter(key=>{
            if(key!="trigger" && details[key]){
              return true;
            }else{
              return false;
            }
          });
          evoForm.how = details.trigger.name;
          switch(details.trigger){
            case "trade":
            break;
            default:
            break;
          }
          evoForm.details = evoKeys.map(how=>{
            switch(how){
              case "item":
                return details.item.name;
              break;
              case "min_happiness":
                return "high happiness";
              break;
              case "time_of_day":
                return details.time_of_day;
              break;
              case "location":
                return "in a special location";
              break;
              case "known_move_type":
                return `knowing a ${details.known_move_type.name} type move`;
              break;
              case "min_affection":
                return "high affection";
              break;
              case "min_level":
                return `lv${details.min_level}`;
              break;
              case "held_item":
                return `trading with ${details.held_item.name}`
              break;
              default:
                return how;
              break;
            }
          });
          //console.log(n.evolution_details[0].trigger)
          //console.log(evoKeys)
          arr.push(evoForm);
          checkEvo(n,arr);
        })
      }
    }
    return arr;
  }
  
  useEffect(()=>{
    //console.log(checkEvo(evolution.chain))
  },[evolution]);
  
  /*

          {species && species.varieties && species.varieties.length>1 && species.varieties.map(n=>{
            const varId = n.pokemon.url.match(urlPattern)[0];
            return(
              <li key={n.pokemon.name} className={n.pokemon.name==monData.name?"active-mon":""}>
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${varId}.png`}/>
                {n.pokemon.name.split("-").join(" ")}
              </li>
            )
          })}
          {evolution && evolution.chain &&
            (<>
              <li>{evolution.chain.species.name}</li>
              {evolution.chain.evolves_to.map(n=>{
                console.log(n)
                return (<li>meh</li>)
              })}
            </>)

          }
          {}
  */
  return(
    <div>
      <div>
        <h3>Forms</h3>
        <ul>
        </ul>
      </div>
      <div>
        <h3>evolutions</h3>
        <ul className="evo-list">
          {evolutionTree(evolution.chain)}
        </ul>
      </div>
    </div>
  )
}
