import { message } from 'antd';
import { DidJson } from 'sk-chain';
import { assign, createMachine, MachineConfig, StateSchema } from 'xstate';
import { SkChain } from './sk';
interface SkNodeMachineContext {
  chain: SkChain;
  chainOpts: {
    forceReady?: boolean;
  };
}

export enum SkNodeEventType {
  'START_CHAIN' = 'START_CHAIN',
  'CONFIG_CHAIN' = 'CONFIG_CHAIN',
}

export type SkNodeStateEvent =
  | { type: SkNodeEventType.START_CHAIN; data: DidJson }
  | {
      type: SkNodeEventType.CONFIG_CHAIN;
      data: Partial<SkNodeMachineContext['chainOpts']>;
    };

export interface SkNodeStateSchema extends StateSchema {
  states: {
    stop: {};
    start: {};
    started: {
      type: 'compound';
      initial: 'idle';
      states: {
        idle: {};
      };
    };
  };
}

export type RenderStateConfig = MachineConfig<
  SkNodeMachineContext,
  SkNodeStateSchema,
  SkNodeStateEvent
>;

export const skNodesMachine = createMachine<SkNodeMachineContext>(
  {
    id: 'skNode',
    initial: 'stop',
    context: {
      chain: new SkChain(),
      chainOpts: {},
    },
    states: {
      stop: {
        on: {
          [SkNodeEventType.START_CHAIN]: { target: 'start' },
          [SkNodeEventType.CONFIG_CHAIN]: {
            actions: assign({
              chainOpts: (context, data) => {
                return {
                  ...context.chainOpts,
                  ...data,
                };
              },
            }),
          },
        },
      },
      start: {
        invoke: {
          id: 'init-sk',
          src: (context, event) => {
            return context.chain.init({
              id: event.id,
              privKey: event.privKey,
            });
          },
          onDone: {
            target: 'started',
            // actions:assign({})
          },
          onError: {
            actions: (c, err) => {
              console.error('init sk-chain err');
              console.log(err);
            },
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
            entry: (context) => {
              const { forceReady } = context.chainOpts;
              context.chain.sk.consensus.setIsReady(Boolean(forceReady));
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
