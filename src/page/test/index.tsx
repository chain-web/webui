import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { SkNodeEventType, skNodesMachine } from '../../state/sk.state';
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
import { historyAction } from '../../utils/history';
import RepoStatus from './components/repoStatus';
import StateRootStatus from './components/stateRootStatus';
import BlockStatus from './components/blockStatus';
import TransactionStatus from './components/transactionStatus';

export default function TestPage() {
  const [current, send] = useMachine(skNodesMachine, { devTools: xstateDev });
  const started = current.matches('started');
  const [t] = useTranslation();
  const start = current.matches('start');
  const { chain } = current.context;
  useEffect(() => {
    // 方便调试，自动启动节点
    const autoStart = +historyAction.pullHashParam('autoStart');
    const forceReady = historyAction.pullHashParam('forceReady');
    if (!isNaN(autoStart) && accounts[autoStart]) {
      setTimeout(() => {
        send(SkNodeEventType.START_CHAIN, accounts[autoStart]);
      }, 4000);
    }

    // 如果是新链，forceReady强制节点为ready状态启动
    send(SkNodeEventType.CONFIG_CHAIN, {
      forceReady,
    });
  }, []);

  // const [priv, setpriv] = useState('');
  return (
    <div className="test-box">
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
                    send(SkNodeEventType.START_CHAIN, ele);
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
          {started && <RepoStatus />}
          {started && <StateRootStatus />}
          {started && <BlockStatus />}
          {started && <TransactionStatus />}
        </div>
      </div>
      {<Transaction />}
      {<Devtool />}
    </div>
  );
}
