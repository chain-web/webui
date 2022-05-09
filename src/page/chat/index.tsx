import { useActor } from '@xstate/react';
import { useEffect } from 'react';
import { skService } from '../../state/sk.state';
import { ChatEventType, chatService } from './chat.state';

export const Chat = () => {
  const [current] = useActor(skService);
  const [{ context }] = useActor(chatService);
  useEffect(() => {
    chatService.send(ChatEventType.INIT_CHAT, {
      data: current.context.chain.sk,
    });
  }, [current.context.chain.started]);

  return (
    <div>
      {context.msgList.map((ele) => (
        <span>{ele.msg}</span>
      ))}
    </div>
  );
};
