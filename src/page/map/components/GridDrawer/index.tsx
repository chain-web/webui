import { useActor } from '@xstate/react';
import { Button, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getSelfDid, skService } from '../../../../state/sk.state';
import { MapEventType, mapService } from '../../map.state';
import './index.scss';
import { getGridData } from './data.service';
import { GridItemData, GridType } from '../../contract/interface';
import { mapContract } from '../../contract/mapContract';
import { CID, Transaction, TransStatus } from 'sk-chain';

export default function GridDrawer() {
  const [{ context }] = useActor(mapService);
  const [
    {
      context: { uTime, chain },
    },
  ] = useActor(skService);
  const { activeHex, showGridDetail } = context.grid;
  const [grid, setgrid] = useState<GridItemData>();
  const [gridtype, setgridtype] = useState(GridType.clay);
  const [building, setbuilding] = useState(false);
  const [taking, setTaking] = useState(false);
  useEffect(() => {
    if (!activeHex?.hexid) {
      return;
    }
    getGridData(activeHex.hexid).then((data) => {
      if (data) {
        console.log(data);
        setgrid(data);
      }
      const tx = localStorage.getItem(`taking${activeHex.hexid}`);
      if (tx) {
        skService.state.context.chain.sk.transAction
          .transStatus(tx)
          .then((res) => {
            if (
              res.status === TransStatus.transing ||
              res.status === TransStatus.waiting
            ) {
              setTaking(true);
            }
            if (res.status === TransStatus.transed) {
              localStorage.removeItem(`taking${activeHex.hexid}`);
            }
          });
      } else {
        setTaking(false);
      }
    });
  }, [activeHex, uTime]);

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
            {!grid?.owner && (
              <Button
                loading={taking}
                onClick={async () => {
                  const { trans } = await mapContract.toOwn(activeHex.hexid);
                  message.info('taking');
                  setTaking(true);
                  localStorage.setItem(`taking${activeHex.hexid}`, trans.hash);
                }}
              >
                {taking ? 'taking' : 'take'}
              </Button>
            )}
            {/* {grid?.owner === getSelfDid() && (
              <Button
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
              </Button>
            )} */}
          </p>
          <div>
            {grid?.owner === getSelfDid() && (
              <div>
                <div>type: {grid.type}</div>
                <Select
                  value={gridtype}
                  onChange={(e) => {
                    setgridtype(e);
                  }}
                >
                  {Object.keys(GridType).map((ele) => (
                    <Select.Option value={ele} key={ele}>
                      {ele}
                    </Select.Option>
                  ))}
                </Select>
                <p>
                  <Button
                    loading={building}
                    onClick={() => {
                      mapContract.changeGridType(activeHex.hexid, gridtype);
                      setbuilding(true);
                    }}
                  >
                    {building ? 'building' : 'build'}
                  </Button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
