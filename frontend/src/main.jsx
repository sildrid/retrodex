import React from 'react'
import ReactDOM from 'react-dom/client'

import DexTitle from './components/DexTitle.jsx';
import DexScreen from './components/DexScreen.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <DexTitle/>
      <DexScreen/>
  </React.StrictMode>,
)
