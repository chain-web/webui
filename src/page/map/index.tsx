import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.scss';
import Tabbar from './components/Tabbar';
import NeedPremission from './components/needPremission';
import { MapOption, MapService } from 'sk-gridmap';
import { useMachine } from '@xstate/react';
import { MapEventType, mapMachine } from './map.state';
import { xstateDev } from '../../config';
export const mapBoxPk =
  'pk.eyJ1Ijoic2NjLW1hcGJveCIsImEiOiJja292MGsxNXgwMzl0MnZxczJ1ZHJ6MXNhIn0.BP99qksZP77yNqFTyfz_rw';
export const MapBox = () => {
  const [current, send] = useMachine(mapMachine, { devTools: xstateDev });
  useEffect(() => {
    const mapOption: MapOption = {
      container: 'map-container',
      mapBoxPk,
    };
    send(MapEventType.INIT_MAP, { data: mapOption });
  }, []);

  return (
    <div className="home-box">
      <Tabbar />
      {/* <Login /> */}
      {!current.context.hasPremission && <NeedPremission />}
    </div>
  );
};
