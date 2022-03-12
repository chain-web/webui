import { message } from 'antd';
import { assign, createMachine } from 'xstate';
import { SkChain } from './sk';
interface SkNodeMachineContext {
  chain: SkChain;
}

type EventDataI<T> = { type: string } & T;

export const skNodesMachine = createMachine<SkNodeMachineContext>(
  {
    id: 'skNode',
    initial: 'stop',
    context: {
      chain: new SkChain(),
    },
    states: {
      stop: {
        on: { 'START-CHAIN': { target: 'start' } },
      },
      start: {
        invoke: {
          id: 'init-sk',
          src: (context, event) => {
            return context.chain.init({
              id: event.did,
              privKey: event.priv,
            });
          },
          onDone: {
            target: 'started',
            // actions:assign({})
          },
          onError: {
            target: 'stop',
          },
        },
        // entry: assign({ count: (ctx) => ctx.count + 1 }),
      },
      started: {
        type: 'compound',
        initial: 'idle',
        states: {
          idle: {
            type: 'atomic',
            entry: () => {
              console.log('started-------idle');
            },
            // on: {
            //   'SWARM-CONNECT': {
            //     target: 'swarmConnect',
            //   },
            // },
          },
        },
      },
    },
  },
  {
    actions: {},
  },
);
