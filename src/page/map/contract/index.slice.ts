import { constractHelper, ConstractHelper } from 'sk-chain';
import { factoryLevelUp } from './util';

// 合约数据存储也slice，还没想到好的解决办法
// TODO slice

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
    // 数据的存储分片还是需要的
    // 真实存在链上的数据kv结构，key 暂定，可能需要方便进行分片，可能是 const did = constractHelper.hash(hexid);
    // value是dag put的cid
    // 外部应用方便直接用dag get，来获取数据
    this.gridDb = constractHelper.createSliceDb<GridItemData>('base32');
    this.userDb = constractHelper.createSliceDb<UserData>('base58');
  }
  userDb: ConstractHelper.SliceDb<UserData>;
  gridDb: ConstractHelper.SliceDb<GridItemData>;

  static levelBase = 3600 * 24 * 1000;

  toOwn = (hexid: string) => {
    const did = constractHelper.hash(hexid);
    this.checkLevelDown(did);
    if (!this.gridDb.get(did) || this.gridDb.get(did).level === 0) {
      return;
    }
    this.gridDb.set(did, {
      id: hexid,
      owner: this.msg.sender,
      level: 1,
      uTime: this.msg.ts,
    });
  };

  levelUp = (did: string) => {
    this.checkLevelDown(did);
    const item = this.gridDb.get(did);
    if (!item || item.level === 0 || item.owner !== this.msg.sender) {
      return;
    }
    factoryLevelUp();
    if (this.userDb.get(this.msg.sender)) {
      //TODO 检查是否有足够的资源升级
      this.gridDb.set(did, {
        ...item,
        level: item.level + 1,
        uTime: this.msg.ts,
      });
    }
  };

  checkLevelDown = (did: string) => {
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
        gap -= Math.pow(2, level)
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