import { useActor } from '@xstate/react';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { skService } from '../../state/sk.state';
import { ChatEventType, chatService } from './chat.state';

export const Chat = () => {
  const [current] = useActor(skService);
  const [{ context }] = useActor(chatService);

  const [ipt, setipt] = useState('');
  useEffect(() => {
    if (current.context.chain.started && !context.chat) {
      chatService.send(ChatEventType.INIT_CHAT, {
        data: current.context.chain.sk,
      });
    }
  }, [current.context.chain.started]);

  if (!context.chat) {
    return null;
  }

  return (
    <div
      className="chat-box"
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <div className="msg-list">
        {context.msgList.map((ele) => (
          <div>{ele.msg}</div>
        ))}
      </div>
      <div
        className="ipt-box"
        style={{ position: 'absolute', bottom: 0, width: '100%', padding: 12 }}
      >
        <Input
          style={{ width: '100%' }}
          onChange={(e) => {
            setipt(e.target.value);
          }}
          value={ipt}
          onKeyPress={(e) => {
            if (e.code === 'Enter') {
              context.chat.sendMsg(ipt);
              setipt('');
            }
          }}
        />
      </div>
    </div>
  );
};
