import { useMachine } from '@xstate/react';
import React, { useEffect } from 'react';
import { MapEventType, mapMachine } from '../../map.state';
import './index.less';

export default function GridDrawer() {
  const [current, send] = useMachine(mapMachine);
  const { activeHex, showGridDetail } = current.context.grid;
  return (
    <div
      style={{ bottom: showGridDetail ? '0px' : '-256px' }}
      className="grid-msg-box"
    >
      {!!activeHex.hex && (
        <div className="grid-msg-content">
          <span
            onClick={() => {
              send(MapEventType.UPDATE_GRID, { showGridDetail: false });
            }}
          >
            close
          </span>
          <p>ID: {activeHex.hex.hexid}</p>
          <p>富饶度: 1</p>
          <p>所有者：无</p>
        </div>
      )}
    </div>
  );
}
