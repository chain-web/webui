import React from 'react';
import { useRoutes } from 'react-router-dom';
import TestPage from './page/test';
import './App.css';
import 'antd/dist/antd.css';
import { MapBox } from './page/map';

function App() {
  let element = useRoutes([
    { path: '/test', element: <TestPage /> },
    { path: '/map', element: <MapBox /> },
  ]);

  return element;
}

export default App;
