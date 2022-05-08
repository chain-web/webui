import { useActor } from '@xstate/react';
import { useEffect } from 'react';
import { skService } from '../../state/sk.state';
import { initSkChainChat } from './chatservice';

export const Chat = () => {
  const [current] = useActor(skService);
  useEffect(() => {
    current.context.chain.started && initSkChainChat(current.context.chain.sk);
  }, [current.context.chain.started]);

  return <div>Chat</div>;
};
