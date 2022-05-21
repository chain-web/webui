import { useActor } from '@xstate/react';
import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getSelfDid } from '../../../../state/sk.state';
import { MapEventType, mapService } from '../../map.state';
import './index.scss';
import { getGridData } from './data.service';
import { GridItemData, GridType } from '../../contract/interface';
import { mapContract } from '../../contract/mapContract';

export default function GridDrawer() {
  const [{ context }] = useActor(mapService);
  const { activeHex, showGridDetail } = context.grid;
  const [grid, setgrid] = useState<GridItemData>();
  const [gridtype, setgridtype] = useState(GridType.clay);
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
            {!grid?.owner && (
              <Button
                onClick={() => {
                  mapContract.toOwn(activeHex.hexid);
                }}
              >
                take
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
                    onClick={() => {
                      mapContract.changeGridType(activeHex.hexid, gridtype);
                    }}
                  >
                    build
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
