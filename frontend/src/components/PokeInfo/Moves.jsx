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
  
  const sorter = (a,b)=>{
    if(a.level>b.level){
      return true;
    }
    return false;
  }
  for(let key in versionMoves){
    versionMoves[key].sort(sorter);
  }

  const fixText = (str)=>{
    return str.replace("-"," ");
  }

  const moveBox = (mv,hideInfo)=>{
    return(
      <div className={mv.type+"-bg move-box"}>
        <h3>{fixText(mv.info.name)}</h3>
        <div className="acc-cat-pow">
          <p>acc:{mv.info.accuracy || "--"}</p>
          <div className="move-class-image-wrapper">
            <img src={`../${mv.info.class}.png`}/>
          </div>
          <p>pow:{mv.info.power || "--"}</p>
        </div>
        {!hideInfo &&
        <div className="move-effect-wrapper">
          <p>{mv.info.short_effect}</p>
        </div>
        }
      </div>
    )
  }
  return(
    <div className="info-moves">
      <form>
        <h4>Game:</h4>
        <select onChange={e=>{
            setMoveGen(e.target.value);
          }}>
          <option value="all">All</option>
          {Object.keys(versionMoves).map(ver=>{
            return <option value={ver}>{fixText(ver)}</option>
          })
          }
        </select>
      </form>
      {moveGen == "all" &&
        <>
          <ul className="info-move-full-list">
            {moveList.map(n=>{
              return(
                <li>
                  {moveBox(n,true)}
                </li>
              )
            })}
          </ul>
        </>
      }
      {moveGen != "all" &&
        <>
          <h3>Lv Up Moves:</h3>
          <ul className="info-move-list">
            {versionMoves[moveGen].map(n=>{
              if(n.method.name=="level-up"){
                return(
                  <li>
                    <div className="lv-up-move-info">
                      {n.level <=1 ? n.level == 0 ? "Evolve" : "Start" : `Lv ${n.level}`}
                    </div>
                    {moveBox(n)}
                  </li>
                )
              }
              return
            })}
          </ul>
        </>
      }
      {moveGen != "all" &&
        <>
          <h3>TM/HM Moves:</h3>
          <ul className="info-move-list">
            {versionMoves[moveGen].map(n=>{
              if(n.method.name=="machine"){
                return(
                  <li>
                    {moveBox(n)}
                  </li>
                )
              }
              return
            })}
          </ul>
        </>
      }
      {moveGen != "all" &&
        <>
          <h3>Tutor Moves:</h3>
          <ul className="info-move-list">
            {versionMoves[moveGen].map(n=>{
              if(n.method.name=="tutor"){
                return(
                  <li>
                    {moveBox(n)}
                  </li>
                )
              }
              return
            })}
          </ul>
        </>
      }
      {moveGen != "all" &&
        <>
          <h3>Egg Moves:</h3>
          <ul className="info-move-list">
            {versionMoves[moveGen].map(n=>{
              if(n.method.name=="egg"){
                return(
                  <li>
                    {moveBox(n)}
                  </li>
                )
              }
              return
            })}
          </ul>
        </>
      }
    </div>
  )
}
