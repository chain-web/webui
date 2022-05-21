import { ConstractHelper, constractHelper } from 'sk-chain';
import { GridItemData, GridType, UserData } from './interface';
import { factoryLevelUp } from './util';

export class Contract extends constractHelper.BaseContract {
  constructor() {
    super();
    this.gridDb = constractHelper.createSliceDb<GridItemData>('base32');
    this.userDb = {};
  }
  private userDb: { [key: string]: UserData };
  private gridDb: ConstractHelper.SliceDb<GridItemData>;

  static levelBase = 3600 * 24 * 1000;

  public toOwn = (hexid: string) => {
    const did = constractHelper.hash(hexid);
    this.checkLevelDown(did);

    if (this.gridDb.get(did) && this.gridDb.get(did).level !== 0) {
      return;
    }

    this.gridDb.set(did, {
      id: hexid,
      owner: this.msg.sender,
      level: 1,
      uTime: this.msg.ts,
    });
  };

  public changeGridType = (hexid: string, type: GridType) => {
    const did = constractHelper.hash(hexid);
    this.checkLevelDown(did);
    const item = this.gridDb.get(did);
    if (item && item.owner !== this.msg.sender) {
      return;
    }

    this.gridDb.set(did, {
      ...item,
      type,
      uTime: this.msg.ts,
    });
  };

  public levelUp = (did: string) => {
    this.checkLevelDown(did);
    const item = this.gridDb.get(did);
    if (!item || item.level === 0 || item.owner !== this.msg.sender) {
      return;
    }
    factoryLevelUp();
    if (this.userDb[this.msg.sender]) {
      //TODO 检查是否有足够的资源升级
      this.gridDb.set(did, {
        ...item,
        level: item.level + 1,
        uTime: this.msg.ts,
      });
    }
  };

  private checkLevelDown = (did: string) => {
    // TODO add contract 定时任务?
    //
    // 或者是有另一种解决方案，在每次读取grid时checkLevelDown,目前先用这个实现
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
