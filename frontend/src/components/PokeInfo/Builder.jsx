import {useState} from 'react';
import './Builder.css';
export default function({monData}){
  const [ev, setEv] = useState(0);
  const [statValue, setStatValue] = useState({});

  const evUpdate = (e)=>{
    const inputArr = [...document.querySelectorAll(`input[name=${e.target.name}]`)];
    inputArr.forEach(n=>{
      if(n.value!=e.target.value){
        n.value=e.target.value;
      }
    })
    const evArr = [...document.querySelectorAll(`input[type=number]`)];
    const evPoints = evArr.reduce((total,input)=>{return total+parseInt(input.value)},0);
    if(evPoints>510){
      inputArr.forEach(n=>{
        n.value-= evPoints-510;
      })
    }
    const newStat = statValue;
newStat[e.target.name]=e.target.value
    setStatValue(newStat);
  }
  const statCalc = (stat)=>{
    const statEv = document.querySelector(`input[name=${stat}]`);
    console.log(statEv);
  }
  const statBar = (stat)=>{
    return(
      <div className={stat.stat.name}>
        <div>{statValue.hp}</div>
      <label>
        {stat.stat.name}
      </label>
        <input name={stat.stat.name} type="range" defaultValue="0" max="252" onChange={evUpdate}/>
        <input name={stat.stat.name} type="number" defaultValue="0" max="252" onChange={evUpdate}/>
        {stat.stat.name!="hp" &&
          <>
        <input name="n-nature" type="radio" value={stat.stat.name} defaultChecked/>
        <input name="p-nature" type="radio" value={stat.stat.name} defaultChecked/>
        </>
        }
      </div>
    )

  }
  return(
    <>
      {monData && monData.stats.map(n=>{
        return statBar(n)
      })}
    </>
  )
}
