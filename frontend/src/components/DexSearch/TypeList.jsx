import "./TypeList.css";
export default function(props){
  return(
    <ul className="type-list">
      {props.list.map(n=>{
        return (
          <li key={n.name} className={n.name+"-bg"}>
            <h4>{n.name}</h4>
            <div>
              {n.weakTo.length>0 &&
                <ul>
                  <h4>Weak To:</h4>
                  {n.weakTo.map(n=><li key={n} className={n+"-bg"}>{n.slice(0,3)}</li>)}
                </ul>
              }
              {n.resists.length>0 &&
                <ul>
                  <h4>Resists:</h4>
                  {n.resists.map(n=><li key={n} className={n+"-bg"}>{n.slice(0,3)}</li>)}
                </ul>
              }
              {n.inmuneTo.length>0 &&
                <ul>
                  <h4>Inmune To:</h4>
                  {n.inmuneTo.map(n=><li key={n} className={n+"-bg"}>{n.slice(0,3)}</li>)}
                </ul>
              }
            </div>
          </li>
        )
      })}
    </ul>
  )
}
