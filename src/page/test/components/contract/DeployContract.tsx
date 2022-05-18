import { Button, Input, message, Select } from 'antd';
import { useActor } from '@xstate/react';
import { useState } from 'react';
import { skService } from '../../../../state/sk.state';
import { Account } from 'sk-chain';

export const DeployContract = (_CodeClass: any, contractCode: Uint8Array) => {
  return function DeployContractComp(props: {
    onSuccess?: (account: Account) => void;
  }) {
    const [{ context }] = useActor(skService);

    return (
      <div style={{}}>
        <Button
          disabled={!context.chain.started}
          onClick={() => {
            skService.state.context.chain.sk
              .deploy({ payload: contractCode })
              .then((account) => {
                props.onSuccess && props.onSuccess(account);
                message.info(
                  'deploy trans send, contract address: ' + account.account,
                );
              });
          }}
        >
          deploy
        </Button>
      </div>
    );
  };
};
