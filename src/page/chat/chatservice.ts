import { SKChain, bytes } from 'sk-chain';

const skChatKey = 'sk_chat_key';

export const initSkChainChat = (chain: SKChain) => {
  chain.db.pubsub.subscribe(skChatKey, async (data) => {
    if (data.from === chain.did) {
      return;
    }

    const msg = bytes.toString(data.data);
    console.log(msg);
  });
};
