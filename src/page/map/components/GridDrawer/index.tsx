import { useActor } from '@xstate/react';
import { Button } from 'antd';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { getSelfDid, skService } from '../../../../state/sk.state';
import { MapEventType, mapService } from '../../map.state';
import { contractAddressKey } from '../Tabbar';
import './index.scss';
import { sha256 } from 'multiformats/hashes/sha2';
import { getGridData } from './data.service';
import { GridItemData } from '../../contract';

export default function GridDrawer() {
  const [{ context }] = useActor(mapService);
  const { activeHex, showGridDetail } = context.grid;
  const [grid, setgrid] = useState<GridItemData>();
  useEffect(() => {
    if (!activeHex?.hexid) {
      return;
    }
    getGridData(activeHex.hexid).then((data) => {
      if (data) {
        setgrid(data);
      }
    });
  }, [activeHex]);

  return (
    <div
      style={{ bottom: showGridDetail ? '0px' : '-256px' }}
      className="grid-msg-box"
    >
      {!!activeHex?.hexid && (
        <div className="grid-msg-content">
          <span
            onClick={() => {
              mapService.send(MapEventType.UPDATE_GRID, {
                showGridDetail: false,
              });
            }}
          >
            close
          </span>
          <p>ID: {activeHex.hexid}</p>
          <p>所有者：{grid?.owner || '无'}</p>
          <p>
            {! grid?.owner &&<Button
              onClick={() => {
                skService.state.context.chain.sk.transaction({
                  recipient: localStorage.getItem(contractAddressKey)!,
                  amount: new BigNumber(0),
                  payload: {
                    mothed: 'toOwn',
                    args: [activeHex.hexid],
                  },
                });
              }}
            >
              take
            </Button>}
            {grid?.owner === getSelfDid() &&<Button
              onClick={() => {
                skService.state.context.chain.sk.transaction({
                  recipient: localStorage.getItem(contractAddressKey)!,
                  amount: new BigNumber(0),
                  payload: {
                    mothed: 'levelUp',
                    args: [activeHex.hexid],
                  },
                });
              }}
            >
              level up
            </Button>}
          </p>
        </div>
      )}
    </div>
  );
}
