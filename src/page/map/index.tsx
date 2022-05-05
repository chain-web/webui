import React, { useEffect, useState } from 'react';
import './index.less';
import Tabbar from './components/Tabbar';
import NeedPremission from './components/needPremission';
import Login from './components/Login';
import { MapService } from 'sk-gridmap';

const Home = () => {
  const [hasPremission, setHasPremission] = useState(false);
  const [mapService, setMapService] = useState<MapService>()
  useEffect(() => {
    setMapService(new MapService({
      container: 'map-container',
      mapBoxPk: ''
    }))
 
    // mapService.initPosition((data) => {
    //   setHasPremission(true);
    //   mapAction.addDefaultHexLayer(data);
    // });
    // mapAction.bindClickEvent();
  }, []);

  return (
    <div className="home-box">
      <Tabbar />
      <Login />
      {!hasPremission && <NeedPremission />}
    </div>
  );
};

export default Home;
