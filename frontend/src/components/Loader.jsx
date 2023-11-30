import './Loader.css';
export default function(props){
  return(
    <div className={props.loading?"loader":"loader loaded"}>
      <div className="top-left"></div>
      <div className="top-right"></div>
      <div className="bottom-left"></div>
      <div className="bottom-right"></div>
      <div className="lens"></div>
    </div>
  )
}
