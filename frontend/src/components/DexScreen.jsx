import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {useState, useEffect} from 'react';

import './DexScreen.css';
import NotFound from '../pages/NotFound.jsx';
import DexSearch from '../pages/DexSearch.jsx';

export default function(){
  const [dexData, setDexData] = useState({pokemon:[], types:[], abilities:[]});
  useEffect(()=>{
    const getDexData = async ()=>{
      const response = await fetch('http://localhost:8000/api/data');
      const data = await response.json();
      setDexData(data);
      console.log("fetched")
    }
    getDexData();
  },[]);

  return(
    <main className="dex-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/search" element={<DexSearch data={dexData}/>}/>
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}
