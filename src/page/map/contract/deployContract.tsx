import { Button, message } from 'antd';
import contractCode from './index.contract';
import { skService } from '../../../state/sk.state';
import { useActor } from '@xstate/react';

export function DeployContract() {
  const [{ context }] = useActor(skService);

  return (
    <div style={{}}>
      <Button
        disabled={!context.chain.started}
        onClick={() => {
          skService.state.context.chain.sk
            .deploy({ payload: contractCode })
            .then((account) => {
              message.info(
                'deploy trans send, contract address: ' + account.account,
                20,
              );
            });
        }}
      >
        deploy
      </Button>
    </div>
  );
}
