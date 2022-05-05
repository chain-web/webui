import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { d3Server } from '../../../../d3server/lib';
import { ReduxStoreState, useAction } from '../../../../store';
import { homeActions } from '../../../../store/home';
import './index.less';

export default function GridDrawer() {
  const { showGridDetail, activeHex } = useSelector(
    (store: ReduxStoreState) => store.home,
  );
  const { updateStore } = useAction(homeActions);

  useEffect(() => {
    d3Server;
  }, []);

  return (
    <div
      style={{ bottom: showGridDetail ? '0px' : '-256px' }}
      className="grid-msg-box"
    >
      {!!activeHex.hex && (
        <div className="grid-msg-content">
          <span
            onClick={() => {
              updateStore({ showGridDetail: false });
            }}
          >
            close
          </span>
          <p>ID: {activeHex.hex.hexid}</p>
          <p>富饶度：1</p>
          <p>所有者：无</p>
        </div>
      )}
    </div>
  );
}
