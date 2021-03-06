import { ConstractHelper, constractHelper, BaseContract } from 'sk-chain';
import { ElementTypes } from '../elements';
import { GridItemData, GridType, UserData } from './interface';
import { factoryLevelUp, initElementData, initGridData } from './util';
export class Contract extends BaseContract {
  constructor() {
    super();
    this.gridDb = constractHelper.createSliceDb<GridItemData>('base32');
    this.userDb = {};
  }
  private userDb: { [key: string]: UserData };
  private gridDb: ConstractHelper.SliceDb<GridItemData>;

  static levelBase = 3600 * 24 * 1000;

  public toOwn = (hexid: string): { succ: boolean } => {
    const did = constractHelper.hash(hexid);
    this.checkLevelDown(did);

    if (this.gridDb.get(did) && this.gridDb.get(did).level !== 0) {
      return { succ: false };
    }

    this.gridDb.set(did, {
      id: hexid,
      owner: this.msg.sender.did,
      level: 1,
      uTime: this.msg.ts,
      data: initGridData(GridType.empty),
    });
    return { succ: true };
  };

  public changeElementType = (
    hexid: string,
    type: ElementTypes,
  ): { succ: boolean } => {
    const did = constractHelper.hash(hexid);
    this.checkLevelDown(did);
    const item = this.gridDb.get(did);
    if (
      !item ||
      item.owner !== this.msg.sender.did ||
      item.data.type !== GridType.factoryL0
    ) {
      return { succ: false };
    }

    this.gridDb.set(did, {
      ...item,
      data: initElementData(type),
      uTime: this.msg.ts,
    });

    return { succ: true };
  };

  public changeGridType = (
    hexid: string,
    type: GridType,
  ): { succ: boolean } => {
    const did = constractHelper.hash(hexid);
    this.checkLevelDown(did);
    const item = this.gridDb.get(did);
    if (item && item.owner !== this.msg.sender.did) {
      return { succ: false };
    }
    this.gridDb.set(did, {
      ...item,
      data: initGridData(type),
      uTime: this.msg.ts,
    });

    return { succ: true };
  };

  public levelUp = (did: string) => {
    this.checkLevelDown(did);
    const item = this.gridDb.get(did);
    if (!item || item.level === 0 || item.owner !== this.msg.sender.did) {
      return;
    }
    factoryLevelUp();
    if (this.userDb[this.msg.sender.did]) {
      //TODO ????????????????????????????????????
      this.gridDb.set(did, {
        ...item,
        level: item.level + 1,
        uTime: this.msg.ts,
      });
    }
  };

  private checkLevelDown = (did: string) => {
    // TODO add contract ?????????????
    //
    // ???????????????????????????????????????????????????grid???checkLevelDown,????????????????????????
    const item = this.gridDb.get(did);
    if (item && item.level > 0) {
      let gap = this.msg.ts - item.uTime;
      let level = 0;
      if (gap > 0) {
        level = Math.floor(Math.sqrt(Math.floor(gap / 1000 / 60 / 60 / 10)));
      }
      while (gap > Contract.levelBase) {
        gap -= Math.pow(2, level);
        level--;
      }
      if (gap > 0) {
        level++;
      }
      // owner lost the grid
      this.gridDb.set(did, {
        ...item,
        level,
        uTime: this.msg.ts,
      });
    }
  };
}
