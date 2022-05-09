import { SKChain } from 'sk-chain';
import {
  assign,
  createMachine,
  interpret,
  MachineConfig,
  StateSchema,
} from 'xstate';
import { ChatServer, MessageItem } from './chat.server';
interface ChatMachineContext {
  chat: ChatServer;
  msgList: MessageItem[];
}

export enum ChatEventType {
  'INIT_CHAT' = 'INIT_CHAT',
}

export type ChatStateEvent = { type: ChatEventType.INIT_CHAT; data: SKChain };

export interface ChatStateSchema extends StateSchema {
  initial: 'uninit';
  states: {
    uninit: {};
    inited: {};
  };
}

export type ChatStateConfig = MachineConfig<
  ChatMachineContext,
  ChatStateSchema,
  ChatStateEvent
>;
const ChatMachineConfig: ChatStateConfig = {
  id: 'skNode',
  initial: 'uninit',
  context: {
    chat: undefined as unknown as ChatServer,
    msgList: [],
  },
  states: {
    uninit: {
      on: {
        [ChatEventType.INIT_CHAT]: {
          actions: [
            assign({
              chat: (_ctx, event) => {
                return new ChatServer(event.data);
              },
            }),
          ],
          target: 'inited',
        },
      },
    },
    inited: {
      entry: (ctx) => {
        ctx.chat.listenMsg((msg) => {
          ctx.msgList.push(msg);
        });
      },
    },
  },
};

export const ChatMachine = createMachine(ChatMachineConfig);

export const chatService = interpret(ChatMachine);

chatService.start();
