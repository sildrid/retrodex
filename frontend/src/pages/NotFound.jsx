import {useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import './NotFound.css';
export default function(){
  const [timer, setTimer] = useState(false);
  useEffect(()=>{
    setTimeout(()=>{setTimer(true)},3000);
  },[])
  return(
    <>
      <div className="not-found">
        <h2>404</h2>
        <h3>Sorry, something went wrong..</h3>
        <p>redirecting to main screen...</p>
        {(timer &&
          <Navigate to="/search" replace="true"/>
        )}
      </div>
    </>
  )
}
