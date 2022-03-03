import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { skNodesMachine } from "./store";
import "./index.scss";
import { accounts } from "./accounts";
import { skCacheKeys } from "sk-chain";
import Devtool from "./components/devtool";
import { xstateDev } from "../../config";
import Transaction from "./components/transaction";
import NodeStatus from "./components/nodeStatus";
import ChangeI18n from "../../config/i18nSelect";

export default function Home() {
  useEffect(() => {}, []);
  const [current, send] = useMachine(skNodesMachine, { devTools: xstateDev });
  const started = current.matches("started");
  const start = current.matches("start");
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
                    send("START-CHAIN", { did: ele.id, priv: ele.privKey });
                  }}
                >
                  启动节点
                </Button>
              )}
            </div>
          );
        })}
        <div className="home-node-status">
          {start && (
            <Button type="default" loading={true}>
              节点启动中
            </Button>
          )}
          {started && <p>{chain.sk.db.cache.get(skCacheKeys.accountId)}</p>}
          {started && <Button type="ghost">启动成功</Button>}
          {started && <NodeStatus />}
        </div>
      </div>
      {<Transaction />}
      {<Devtool />}
    </div>
  );
}
