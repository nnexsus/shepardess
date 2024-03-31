import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';

import ControlPanel from './components/control/control-panel';
import Control from './components/control/control';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <Router>
      <Routes>
        <Route path='/control-panel' element={<ControlPanel/>}/>
        <Route path='/control' element={<Control/>}/>
        <Route path='/settings' element={<App/>}/>
        <Route path='/contact' element={<App/>}/>
        <Route path='/home' element={<App/>}/>
        <Route path='/' element={<App/>}/>
      </Routes>
    </Router>
  </div>
);