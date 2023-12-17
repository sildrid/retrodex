import './GenderGroup.css';
export default function({typeData, type, species}){
  const maleRatio = species.gender_rate>=0 ? species.gender_rate*12.5 : -1;
  return(
    <div className="type-gender">
      <h3>Gender Ratio:</h3>
      {species.name &&
        <div className="gender-container">
          {maleRatio<0 &&
            <div className="gender-bar" style={{background: 'grey'}}>
              <p></p><p>Unknown</p><p></p>
            </div>
          }
          {species.gender_rate>=0 &&
            <div className="gender-bar" style={{background: `linear-gradient(-90deg, orchid, orchid ${maleRatio-2}%, deepskyblue ${maleRatio+2}%)`}}>
              <p>&#9794; {100-species.gender_rate*12.5}%</p>
              <p>{species.gender_rate*12.5}% &#9792;</p>
            </div>
          }
        </div>
      }
      <h3>Egg Group:</h3>
      <ul className="egg-group">
        {
          species.name &&
            species.egg_groups.map(n=>{
              return <li>{n.name}</li>
            })
        }
      </ul>
    </div>
  )
}
