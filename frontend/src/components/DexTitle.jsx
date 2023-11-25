import whiteBall from '../assets/white-ball.svg';
import './DexTitle.css';
export default function(){
  return (
      <header className="dex-title">
        <img src={whiteBall}/>
        <h1>Retrodex v2</h1>
      </header>
  )

}
