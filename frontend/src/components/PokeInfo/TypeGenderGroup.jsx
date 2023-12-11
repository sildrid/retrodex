import './TypeGenderGroup.css';
export default function({typeData, type, species}){
  const weakres = ()=>{
    const typeMatchups = {}
    const weakneses = [];
    const resistances = [];
    const inmunity = [];
    if(type && typeData){
      const typeProperties = typeData.filter(x=>{
        if(type.find(n=>{return n.type.name==x.name})){
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
          weakneses.push({name:key, value:typeMatchups[key]});
        }else if(typeMatchups[key]>0 && typeMatchups[key]<1){
          resistances.push({name:key, value:typeMatchups[key]});
        }else if(typeMatchups[key]==0){
          inmunity.push({name:key, value:typeMatchups[key]});
        }
      }
    }
    return(
      <div>
        <h3>Weak To:</h3>
        <ul>
          {weakneses.map(n=>{
            return(
              <li>
                {n.name}(x{n.value})
              </li>
            )
          })}
        </ul>
        <h3>Resists:</h3>
        <ul>
          {resistances.map(n=>{
            return(
              <li>
                {n.name}(x{n.value})
              </li>
            )
          })}
        </ul>
        <h3>Inmune To:</h3>
        <ul>
          {inmunity.map(n=>{
            return(
              <li>
                {n.name}
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
  return(
    <div className="type-gender">
      {weakres()}
      <h3>Gender Ratio:</h3>
      {species.name &&
        <div class-name="gender-container">
          <div className="gender-bar" style={{width: '50%', backgroundColor: 'red'}}>asd</div>
          Male: {100-species.gender_rate*12.5}%<br/>
          Female: {species.gender_rate*12.5}%
        </div>
      }
      <h3>Egg Group:</h3>
      <p>{species.name && species.egg_groups.map(n=>{return <span>{n.name}</span>})}</p>
    </div>
  )
}
