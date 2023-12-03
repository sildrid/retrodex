import './ServerError.css';
import missignoImg from '../assets/missigno.png';
export default function(){
  return (
    <div className="server-error">
      <h3>Service is<br/>unavailable</h3>
      <img src={missignoImg}/>
      <p>Please try again later</p>
    </div>
  )
}
