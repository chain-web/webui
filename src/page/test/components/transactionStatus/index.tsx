import React, { useEffect, useState } from 'react';
import { skNodesMachine } from '../../index.state';
import './index.scss';
import { useMachine } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import { lanKeys } from './index.i18n';
import { JsonView } from '../../../../components/JsonView';
import { CID } from 'sk-chain';

export default function TransactionStatus() {
  const [current] = useMachine(skNodesMachine);
  const [t] = useTranslation();
  const [blocks, setBlocks] = useState<object>({});
  const [showBlock, setshowBlock] = useState(false);
  useEffect(() => {}, []);

  // TODO 名字直接copy的blockStatus，得改
  const node = current.context.chain.sk;
  const getHeaderBlock = () => {
    const blockGets: any[] = [];
    node.blockService.getHeaderBlock().then((res) => {
      node.db.dag.get(CID.parse(res.header.transactionsRoot)).then((res) => {
        res.value.Links.forEach((link: any) => {
          blockGets.push(node.db.dag.get(link.Hash));
        });

        Promise.all(blockGets).then((res) => {
          const obj: any = {};
          res.map((ele: { value: any }) => {
            obj[ele.value[5]] = ele.value;
          });
          setshowBlock(true);
          setBlocks(obj);
        });
      });
    });

  
  };
  return (
    <div className="status-box">
      <h3>{t(lanKeys.transactionStatus)}</h3>

      <div className="status-item">
        <Button onClick={getHeaderBlock}>👀</Button>
      </div>

      {showBlock && (
        <Modal
          visible={true}
          width={800}
          title={t(lanKeys.transactionStatus)}
          onCancel={() => {
            setshowBlock(false);
          }}
          footer={null}
          className=""
        >
          {blocks && <JsonView data={blocks} />}
        </Modal>
      )}
    </div>
  );
}
