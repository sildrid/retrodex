import "./MoveList.css";
export default function(props){
  return(
    <ul className="moves-list">
      {props.list.map(n=>{
        return n.moves.map(move=>{
          return(
            <li key={move.name} className={n.name+"-bg"}>
              <h4>{move.name}</h4>
              <div>
                <img src={move.class+".png"}/>
                <div className={move.class+"-cat"}>
                  Pow:{move.power}<br/>Acc:{move.accuracy}
                </div>
              </div>
              <p>{move.short_effect}</p>
            </li>
          )
        })
      })}
    </ul>
  )
}
