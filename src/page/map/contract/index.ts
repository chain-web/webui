import { constractHelper } from 'sk-chain';
import { factoryLevelUp } from './util';

interface GridItemData {
  id: string;
  owner: string;
  level: number;
  uTime: number;
}

interface UserData {
  rs: {
    coin: BigInt;
    clay: BigInt;
    coal: BigInt;
    blocks: BigInt;
  };
}

export default class Contract extends constractHelper.BaseContract {
  constructor() {
    super();
    this.gridDb = {};
    this.userDb = {};
  }
  userDb: { [key: string]: UserData };
  gridDb: { [key: string]: GridItemData };

  static levelBase = 3600 * 24 * 1000;

  toOwn = (hexid: string) => {
    const did = constractHelper.hash(hexid);
    // constractHelper.log(did);
    this.checkLevelDown(did);
    if (this.gridDb[did] && this.gridDb[did].level !== 0) {
      return;
    }
    this.gridDb[did] = {
      id: hexid,
      owner: this.msg.sender,
      level: 1,
      uTime: this.msg.ts,
    };
  };

  levelUp = (did: string) => {
    this.checkLevelDown(did);
    const item = this.gridDb[did];
    if (!item || item.level === 0 || item.owner !== this.msg.sender) {
      return;
    }
    factoryLevelUp();
    if (this.userDb[this.msg.sender]) {
      //TODO 检查是否有足够的资源升级
      this.gridDb[did] = {
        ...item,
        level: item.level + 1,
        uTime: this.msg.ts,
      };
    }
  };

  checkLevelDown = (did: string) => {
    // TODO add contract 定时任务?
    //
    // 或者是有另一种解决方案，在每次读取grid时checkLevelDown,目前先用这个实现
    const item = this.gridDb[did];
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
      this.gridDb[did] = {
        ...item,
        level,
        uTime: this.msg.ts,
      };
    }
  };
}
