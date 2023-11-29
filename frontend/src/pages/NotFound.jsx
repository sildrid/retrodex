import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './NotFound.css';
export default function(){
  const navigate = useNavigate();
  useEffect(()=>{
    setTimeout(()=>{navigate("/search")},3000);
  },[])
  return(
    <>
      <div className="not-found">
        <h2>404</h2>
        <h3>Sorry, something went wrong..</h3>
        <p>Redirecting to main screen...</p>
      </div>
    </>
  )
}
