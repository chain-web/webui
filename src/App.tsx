import React from 'react';
import { useRoutes } from 'react-router-dom';
import TestPage from './page/test';
import './App.css';
import 'antd/dist/antd.css';

function App() {
  let element = useRoutes([{ path: '/test', element: <TestPage /> }]);

  return element;
}

export default App;
