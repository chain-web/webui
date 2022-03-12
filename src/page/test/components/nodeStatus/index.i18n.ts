import { genLanKeys } from '../../../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      node_status: 'node status',
      sliceName: 'current slice key',
      slicePeerSize: 'current slice peer count',
      slicePeerList: 'peer list',
    },
  },
  zh: {
    translations: {
      node_status: '节点状态',
      sliceName: '当前分片',
      slicePeerSize: '当前分片节点数',
      slicePeerList: '节点列表',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
