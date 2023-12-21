import {useState} from 'react';
import './Moves.css';
export default function({data, monData}){
  const [moveGen, setMoveGen] = useState("all");
  const versionMoves = {};
  const typeList = data.types;
  const moveList = monData.moves.map(n=>{
    const foundType = typeList.find(type=>{
      return type.moves.find(mv=>mv.name==n.move.name);
    });
    const moveInfo = foundType.moves.find(mv=>{
      return mv.name == n.move.name;
    })
    n.version_group_details.forEach(ver=>{
      if(!versionMoves[ver.version_group.name]){
        versionMoves[ver.version_group.name] = [];
      }
      versionMoves[ver.version_group.name].push({
        type: foundType.name,
        info: moveInfo,
        level: ver.level_learned_at,
        method: ver.move_learn_method
      });
    });
    return {type: foundType.name, info: moveInfo, method: n.version_group_details}
  });
  //console.log(versionMoves)
  console.log(moveList)

  const fixText = (str)=>{
    return str.replace("-"," ");
  }

  return(
    <div className="info-moves">
      <form>
        <ul>
        </ul>
      </form>
      <ul className="info-move-list">
        {moveGen == "all" &&
          moveList.map(n=>{
            return(
              <li className={n.type+"-bg"}>
                <h3>{fixText(n.info.name)}</h3>
                <div className="acc-cat-pow">
                  <p>acc:{n.info.accuracy || "--"}</p>
                  <p>{}</p>
                  <p>pow:{n.info.power || "--"}</p>
                </div>
                <p>{}</p>
                <p>{}</p>
                <p>{}</p>
                <p>{}</p>
                <p>{}</p>
                <p>{}</p>
              </li>
            )
          })
        }
      </ul>
      <ul>
        {versionMoves["scarlet-violet"] && versionMoves["scarlet-violet"].map(n=>{
          if(n.method.name=="level-up"){
          return(
            <li>
              <p>{n.info.name}</p>
              <p>{n.type}</p>
              <p>{n.info.class}</p>
              <p>{n.info.power}</p>
              <p>{n.info.accuracy}</p>
              <p>{n.info.short_effect}</p>
            </li>
          )
          }else{
            return <></>
          }
        })
        }
      </ul>
    </div>
  )
}
