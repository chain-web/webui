import { MapService, MapOption, HexService, HexItem } from 'sk-gridmap';
import {
  assign,
  createMachine,
  interpret,
  MachineConfig,
  StateSchema,
} from 'xstate';
import { MapAction } from './map';
interface MapMachineContext {
  map: MapService;
  hasPremission: boolean;
  hexService: HexService;
  mapAction: MapAction;
  grid: {
    showGridDetail: boolean;
    activeHex: HexItem;
  };
}

export enum MapEventType {
  'INIT_MAP' = 'INIT_MAP',
  'UPDATE_GRID' = 'UPDATE_GRID',
}

export type MapStateEvent =
  | { type: MapEventType.INIT_MAP; data: MapOption }
  | {
      type: MapEventType.UPDATE_GRID;
      data: Partial<MapMachineContext['grid']>;
    };

export interface MapStateSchema extends StateSchema {
  initial: 'uninit';
  states: {
    uninit: {};
    inited: {};
  };
}

export type MapStateConfig = MachineConfig<
  MapMachineContext,
  MapStateSchema,
  MapStateEvent
>;
const mapMachineConfig: MapStateConfig = {
  id: 'skNode',
  initial: 'uninit',
  context: {
    map: undefined as unknown as MapService,
    hasPremission: false,
    hexService: new HexService(
      new Worker(
        new URL(
          '../../../node_modules/sk-gridmap/dist/esm/grid.js',
          import.meta.url,
        ),
      ),
    ),
    mapAction: undefined as unknown as MapAction,
    grid: {
      activeHex: undefined as unknown as HexItem,
      showGridDetail: false,
    },
  },
  states: {
    uninit: {
      on: {
        [MapEventType.INIT_MAP]: {
          actions: [
            assign({
              map: (_ctx, event) => {
                return new MapService(event.data);
              },
            }),
          ],
          target: 'inited',
        },
      },
    },
    inited: {
      entry: (ctx) => {
        ctx.mapAction = new MapAction(ctx.map.map);
        ctx.hasPremission = true;
        ctx.map.initPosition((data) => {
          ctx.mapAction.addDefaultHexLayer(data).then(() => {
            ctx.mapAction.bindClickEvent();
          });
        });
      },
      on: {
        [MapEventType.UPDATE_GRID]: {
          actions: [
            assign({
              grid: (ctx, event) => {
                return { ...ctx.grid, ...event.data };
              },
            }),
          ],
        },
      },
    },
  },
};

export const mapMachine = createMachine(mapMachineConfig);

export const mapService = interpret(mapMachine);

mapService.start();
