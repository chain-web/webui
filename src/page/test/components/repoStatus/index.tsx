import React, { useEffect, useState } from 'react';
import { skNodesMachine } from '../../index.state';
import './index.scss';
import { useMachine } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { lanKeys } from './index.i18n';
import { JsonView } from '../../../../components/JsonView';

export default function RepoStatus() {
  const [current] = useMachine(skNodesMachine);
  const [t] = useTranslation();
  const [time, settime] = useState<NodeJS.Timeout>();
  const [repoStatus, setRepoStatus] = useState<object>();
  const [showBlock, setshowBlock] = useState(false);
  useEffect(() => {
    getHeaderBlock();
    return () => {
      clearTimeout(time!);
    };
  }, []);

  const node = current.context.chain.sk;
  const getHeaderBlock = () => {
    node.db.repo.stat().then((res) => {
      setRepoStatus(res);
      const id = setTimeout(() => {
        getHeaderBlock();
      }, 1500);
      settime(id);
    });
  };
  return (
    <div className="status-box">
      <h3>{t(lanKeys.repoStatus)}</h3>

      <div className="status-item">
        {repoStatus && <JsonView data={repoStatus} />}
      </div>

      {showBlock && (
        <Modal
          visible={true}
          title={t(lanKeys.repoStatus)}
          onCancel={() => {
            setshowBlock(false);
          }}
          footer={null}
          className="nodestatus-peer-list-modal-box"
        ></Modal>
      )}
    </div>
  );
}