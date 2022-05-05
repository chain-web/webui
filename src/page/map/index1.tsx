import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { skNodesMachine } from '../../state/sk.state';
import './index.scss';
import { skCacheKeys } from 'sk-chain';
import { xstateDev } from '../../config';
import { MapService } from 'sk-gridmap';

export default function Map() {
  const [current, send] = useMachine(skNodesMachine, { devTools: xstateDev });
  const started = current.matches('started');
  const start = current.matches('start');
  const { chain } = current.context;
  
  useEffect(() => {}, []);

  return <div className="map-box"></div>;
}
