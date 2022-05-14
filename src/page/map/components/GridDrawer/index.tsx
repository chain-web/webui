import { useActor } from '@xstate/react';
import { Button } from 'antd';
import BigNumber from 'bignumber.js';
import { skService } from '../../../../state/sk.state';
import { MapEventType, mapService } from '../../map.state';
import './index.scss';

export default function GridDrawer() {
  const [{ context }] = useActor(mapService);
  const { activeHex, showGridDetail } = context.grid;
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
          <p>所有者：无</p>
          <p>
            <Button onClick={() => {
              skService.state.context.chain.sk.transaction({
                recipient: '',
                amount: new BigNumber(0),
                payload: {
                  mothed: 'toOwn',
                  args: [activeHex.hexid],
                },
              })
            }}>take</Button>
          </p>
        </div>
      )}
    </div>
  );
}
