import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { skNodesMachine } from './store';
import './index.scss';
import { accounts } from './accounts';
import { skCacheKeys } from 'sk-chain';
import Devtool from './components/devtool';
import { xstateDev } from '../../config';
import Transaction from './components/transaction';
import NodeStatus from './components/nodeStatus';
import ChangeI18n from '../../config/i18n/i18nSelect';
import { useTranslation } from 'react-i18next';
import { lanKeys } from './index.i18n';

export default function Home() {
  useEffect(() => {}, []);
  const [current, send] = useMachine(skNodesMachine, { devTools: xstateDev });
  const started = current.matches('started');
  const [t] = useTranslation();
  const start = current.matches('start');
  const { chain } = current.context;
  // const [priv, setpriv] = useState('');
  return (
    <div className="home-box">
      <ChangeI18n />
      <div className="home-start-node">
        {accounts.map((ele) => {
          return (
            <div key={ele.id} className="home-start-one">
              {!started && !start && (
                <p>
                  did: <Input value={ele.id} />
                </p>
              )}
              {!started && !start && (
                <Button
                  onClick={() => {
                    send('START-CHAIN', { did: ele.id, priv: ele.privKey });
                  }}
                >
                  {t(lanKeys.start)}
                </Button>
              )}
            </div>
          );
        })}
        <div className="home-node-status">
          {start && (
            <Button type="default" loading={true}>
              {t(lanKeys.starting)}
            </Button>
          )}
          {started && <p>{chain.sk.db.cache.get(skCacheKeys.accountId)}</p>}
          {started && <Button type="ghost">{t(lanKeys.started)}</Button>}
          {started && <NodeStatus />}
        </div>
      </div>
      {<Transaction />}
      {<Devtool />}
    </div>
  );
}
