import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from './page/home';
import './App.css';
import 'antd/dist/antd.css';

function App() {
  let element = useRoutes([{ path: '/', element: <Home /> }]);

  return element;
}

export default App;
