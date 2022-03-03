

const lans = {
  en: {
    translations: {
      node_status: "node status",
      sliceName: "current slice key",
      slicePreeSize: "current slice pree count",
    },
  },
  zh: {
    translations: {
      node_status: "节点状态",
      sliceName: "当前分片",
      slicePreeSize: "当前分片节点数",
    },
  },
};

export default lans;

export type lanKeys = keyof typeof lans.en.translations;
