import { Button, Input, message, Select } from 'antd';
import { useActor } from '@xstate/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { skService } from '../../../../state/sk.state';

export const TestContract = (CodeClass: any, contractCode: Uint8Array) => {
  const codeClass = new CodeClass();
  return function TestContractComp() {
    const [{ context }] = useActor(skService);
    const [account, setaccount] = useState('');
    const [func, setfunc] = useState('');
    const [arg, setarg] = useState('');

    return (
      <div style={{}}>
        <h3>contract test</h3>
        <Button
          disabled={!context.chain.started}
          onClick={() => {
            skService.state.context.chain.sk.transTest
              .deploy({ payload: contractCode })
              .then((account) => {
                setaccount(account.account);
                message.info(
                  'deploy trans send, contract address: ' + account.account,
                );
              });
          }}
        >
          deploy
        </Button>
        <div>
          func:
          <Select
            disabled={!context.chain.started}
            style={{ width: 200 }}
            onChange={(e) => {
              setfunc(e);
            }}
          >
            {Object.keys(codeClass).map((ele) => (
              <Select.Option key={ele} value={ele}>
                {ele}
              </Select.Option>
            ))}
          </Select>
          arg:
          <Input
            value={arg}
            onChange={(e) => {
              setarg(e.target.value);
            }}
          />
          <Button
            disabled={!context.chain.started}
            onClick={() => {
              if (!func) {
                return;
              }
              console.log('run func', func);
              skService.state.context.chain.sk.transTest
                .transaction({
                  amount: new BigNumber(0),
                  recipient: account,
                  payload: {
                    mothed: func,
                    args: [arg],
                  },
                })
                .then((res: any) => {
                  console.log(res);
                });
            }}
          >
            test
          </Button>
        </div>
      </div>
    );
  };
};
