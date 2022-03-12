import React, { useEffect, useState } from 'react';
import { skNodesMachine } from '../../index.state';
import './index.scss';
import { useMachine } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import { lanKeys } from './index.i18n';

export default function NodeStatus() {
  const [current] = useMachine(skNodesMachine);
  const [t] = useTranslation();
  const [time, settime] = useState(Date.now());
  const [showPeers, setshowPeers] = useState(false);
  useEffect(() => {
    let interval = setInterval(() => {
      settime(Date.now());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const node = current.context.chain.sk;
  return (
    <div className="status-box">
      <h3>{t(lanKeys.node_status)}</h3>
      <div className="status-item">
        <span>{t(lanKeys.slicePeerSize)}: </span>
        <span>{node.slice.slice}</span>
      </div>
      <div className="status-item">
        <span>{t(lanKeys.slicePeerSize)}: </span>
        <span>{node.slice.curPeers.size}</span>
        <Button
          onClick={() => {
            setshowPeers(true);
          }}
        >
          👀
        </Button>
      </div>
      {showPeers && (
        <Modal
          visible={true}
          title={t(lanKeys.slicePeerList)}
          onCancel={() => {
            setshowPeers(false);
          }}
          footer={null}
          className="nodestatus-peer-list-modal-box"
        >
          {Array.from(node.slice.curPeers.keys()).map((ele) => (
            <div className='pree-item' key={ele}>
              <p>{ele}: </p>
              <p>
                active at {Date.now() - (node.slice.curPeers.get(ele)?.ts || 0)}{' '}
                ms ago
              </p>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}
