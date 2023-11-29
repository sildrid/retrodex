import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {useState, useEffect} from 'react';

import './DexScreen.css';
import NotFound from '../pages/NotFound.jsx';
import DexSearch from '../pages/DexSearch.jsx';
import PokeInfo from '../pages/PokeInfo.jsx';
import Loader from '../components/Loader.jsx';

import fetcher from '../modules/fetcher.js';

export default function(){
  const [dexData, setDexData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  useEffect(()=>{
    const getDexData = async ()=>{
      const data = await fetcher('http://localhost:8000/api/data');
      if(Object.keys(data).length>0){
        console.log(data);
        setDexData(data);
      }else{
        setDataError(true);
      }
      setLoading(false);
    }
    getDexData();
  },[]);

  return(
    <main className="dex-screen">
      {!dataError &&
        <BrowserRouter>
          <Routes>
            <Route path="/search" element={<DexSearch data={dexData}/>}/>
            <Route path="/pokemon/:id" element={<NotFound/>}/>
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </BrowserRouter>
      }
      {dataError &&
        <>
        <h3>Server Error:</h3>
        <p>Please come back later.</p>
        </>
      }
      <Loader loading={loading}/>
    </main>
  )
}
