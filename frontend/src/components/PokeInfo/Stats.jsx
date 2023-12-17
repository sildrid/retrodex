import './Stats.css';
export default function({data,monData}){
  const abilities = [];
  const hiddenAbilities = [];
  if(monData.abilities && data.abilities){
    monData.abilities.forEach(n=>{
      if(n.is_hidden){
        hiddenAbilities.push(data.abilities.find(ablt=>{
          return ablt.name==n.ability.name;
        }))
      }else{
        abilities.push(data.abilities.find(ablt=>{
          return ablt.name==n.ability.name;
        }))
      }
    });
  }
  const weakres = ()=>{
    const typeMatchups = {}
    const weaknesses = [];
    const resistances = [];
    const inmunity = [];
    if(monData.types && data.types){
      const typeProperties = data.types.filter(x=>{
        if(monData.types.find(n=>{return n.type.name==x.name})){
          return true;
        }
      });
      typeProperties.forEach(xType=>{
        xType.inmuneTo.forEach(n=>{
          typeMatchups[n] = 0;
        });
        xType.weakTo.forEach(n=>{
          if(typeMatchups[n]){
            typeMatchups[n] *= 2;
          }else{
            typeMatchups[n] = 2;
          }
        });
        xType.resists.forEach(n=>{
          if(typeMatchups[n]){
            typeMatchups[n] *= 0.5;
          }else{
            typeMatchups[n] = 0.5;
          }
        });
      });
      for(let key in typeMatchups){
        if(typeMatchups[key]>1){
          weaknesses.push({name:key, value:typeMatchups[key]});
        }else if(typeMatchups[key]>0 && typeMatchups[key]<1){
          resistances.push({name:key, value:typeMatchups[key]});
        }else if(typeMatchups[key]==0){
          inmunity.push({name:key, value:typeMatchups[key]});
        }
      }
    }
    return(
      <div className="weakres-wrapper">
        <h3>Weaknesses:</h3>
        <ul>
          {weaknesses.map(n=>{
            return(
              <li>
                <span className={n.name+"-bg"}>{n.name}</span>x{n.value}
              </li>
            )
          })}
        </ul>
        <h3>Resists:</h3>
        <ul>
          {resistances.map(n=>{
            return(
              <li>
                <span className={n.name+"-bg"}>{n.name}</span>x{n.value}
              </li>
            )
          })}
        </ul>
        {!!inmunity.length &&
          <>
            <h3>Inmune To:</h3>
            <ul>
              {inmunity.map(n=>{
                return(
                  <li>
                    <span className={n.name+"-bg"}>{n.name}</span>
                  </li>
                )
              })}
            </ul>
          </>
        }
      </div>
    );
  }
  const statBar = (name, size)=>{
    return(
      <li>
        <p className="stat-name">
          {name}:
        </p>
        <div className="stat-bar-container">
          <div
            style={{backgroundColor:"forestgreen", width:`${Math.min(size,100)}%`}}
          >
            {size>100 &&
              <div
                style={{backgroundColor:"gold", width:`${Math.min(size-100,100)}%`}}
              >
                {size>200 &&
                  <div
                    style={{backgroundColor:"red", width:`${size-200}%`}}
                  >
                  </div>
                }
              </div>
            }
          </div>
        </div>
        <p className="stat-number">{size}</p>
      </li>
    )
  }
  return(
    <div className="stats-wrapper">
      <h3>Abilities:</h3>
      <ul className="ability-list">
        {abilities.map(n=>{
          return(
            <li>
              <h4>{n.name}</h4>
              <p>{n.effect}</p>
            </li>
          )
        })}
      </ul>
      <h3>Hidden</h3>
      <ul className="ability-list">
        {hiddenAbilities.map(n=>{
          return(
            <li>
              <h4>{n.name}</h4>
              <p>{n.effect}</p>
            </li>
          )
        })}
      </ul>
      <h3>Stats:</h3>
      {monData.stats &&
        <ul className="stat-list">
          {statBar("HP", monData.stats[0].base_stat)}
          {statBar("Atk", monData.stats[1].base_stat)}
          {statBar("Def", monData.stats[2].base_stat)}
          {statBar("SAtk", monData.stats[3].base_stat)}
          {statBar("SDef", monData.stats[4].base_stat)}
          {statBar("Spd", monData.stats[5].base_stat)}
        </ul>
      }
      {weakres()}
    </div>
  )
}
