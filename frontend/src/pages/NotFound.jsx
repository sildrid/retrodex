import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './NotFound.css';
import pokeballImg from '../assets/pokeball.png';
import clefairyDollImg from '../assets/clefairy-doll.png';
export default function(){
  const navigate = useNavigate();
  useEffect(()=>{
    setTimeout(()=>{navigate("/search")},4000);
  },[])
  return(
    <>
      <div className="not-found">
        <h3>Sorry, there's nothing here.</h3>
        <h2>4<img src={pokeballImg}/>4</h2>
        <img className="not-found-image" src={clefairyDollImg}/>
        <p>Redirecting to main screen...</p>
      </div>
    </>
  )
}
