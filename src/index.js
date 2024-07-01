import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';

import ControlStreams from './components/control/control-streams';
import ControlPanel from './components/control/control-panel';
import ControlMap from './components/control/control-map';
import Control from './components/control/control';
import NotFound from './components/404';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Router>
      <Routes>
        <Route path='/control/streams' element={<ControlStreams/>}/>
        <Route path='/control/panels' element={<ControlPanel/>}/>
        <Route path='/control/map' element={<ControlMap/>}/>
        <Route path='/control' element={<Control/>}/>
        <Route path='/settings' element={<App/>}/>
        <Route path='/contact' element={<App/>}/>
        <Route path='/home' element={<App/>}/>
        <Route path='/' element={<App/>}/>
        <Route path='/*' element={<NotFound/>}/>
      </Routes>
    </Router>
  </>
);