import React, { useEffect, useState } from 'react';
import { skNodesMachine } from '../../index.state';
import './index.scss';
import { useMachine } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import { lanKeys } from './index.i18n';
import { Block } from 'sk-chain';

export default function NodeStatus() {
  const [current] = useMachine(skNodesMachine);
  const [t] = useTranslation();
  const [time, settime] = useState<NodeJS.Timeout>();
  const [headerBlock, setHeaderBlock] = useState<Block>();
  const [showPeers, setshowPeers] = useState(false);
  const [showBlock, setshowBlock] = useState(false);
  useEffect(() => {
    getHeaderBlock()
    return () => {
      clearTimeout(time!);
    };
  }, []);

  const node = current.context.chain.sk;
  const getHeaderBlock = () => {
    node.getHeaderBlock().then((res) => {
      setHeaderBlock(res);
      const id = setTimeout(() => {
        getHeaderBlock();
      }, 800);
      settime(id);
    });
  };
  return (
    <div className="status-box">
      <h3>{t(lanKeys.node_status)}</h3>
      <div className="status-item">
        <span>{t(lanKeys.slicePeerSize)}: </span>
        <span>{node.consensus.slice.slice}</span>
      </div>
      <div className="status-item">
        <span>{t(lanKeys.slicePeerSize)}: </span>
        <span>{node.consensus.slice.curPeers.size}</span>
        <Button
          onClick={() => {
            setshowPeers(true);
          }}
        >
          👀
        </Button>
      </div>
      {headerBlock && (
        <div className="status-item">
          <span>{t(lanKeys.blockNumber)}: </span>
          <span>{headerBlock.header.number.toString()}</span>
        </div>
      )}
      {headerBlock && (
        <div className="status-item">
          <span>{t(lanKeys.blockMsg)}: </span>
          <Button
            onClick={() => {
              setshowBlock(true);
            }}
          >
            👀
          </Button>
        </div>
      )}

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
          {Array.from(node.consensus.slice.curPeers.keys()).map((ele) => (
            <div className="pree-item" key={`${ele}`}>
              <p>{ele}: </p>
              <p>
                active at{' '}
                {Date.now() - (node.consensus.slice.curPeers.get(ele)?.ts || 0)}{' '}
                ms ago
              </p>
            </div>
          ))}
        </Modal>
      )}
      {showBlock && (
        <Modal
          visible={true}
          title={t(lanKeys.blockMsg)}
          onCancel={() => {
            setshowBlock(false);
          }}
          footer={null}
          className="nodestatus-peer-list-modal-box"
        >
          {t(lanKeys.blockHesh)}:<pre>{headerBlock!.hash}</pre>
          {t(lanKeys.blockMsg)}
          <pre>{JSON.stringify(headerBlock!.header, null, 4)}</pre>
        </Modal>
      )}
    </div>
  );
}
