import {useNavigate} from 'react-router-dom';
import './MonList.css';
export default function(props){
  const navigate = useNavigate();
  return(
    <ul className="mon-list">
      {props.list.map(mon=>{
        return(
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
        )
      })}
    </ul>
  )
}
