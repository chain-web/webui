import { constractHelper, ConstractHelper } from 'sk-chain';

interface GridItemData {
  id: string;
  owner: string;
  level: number;
}

class MapContract extends constractHelper.BaseContract {
  constructor() {
    super();
    this.db = constractHelper.createSliceDb<GridItemData>('base58');
  }
  db: ConstractHelper.SliceDb<GridItemData>;

  toOwn = (hexid: string) => {
    this.checkLevelDown(hexid);
    if (!this.db.get(hexid) || this.db.get(hexid).level === 0) {
      return;
    }
    this.db.set(hexid, {
      id: hexid,
      owner: this.msg.sender,
      level: 1,
    });
  };

  checkLevelDown = (hexid: string) => {
    // TODO add contract 定时任务
    // 
    // 或者是有另一种解决方案，在每次读取grid时checkLevelDown,目前先用这个实现
    const item = this.db.get(hexid);
  }
}

export default MapContract;
