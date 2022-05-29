import { Map } from 'mapbox-gl';

export const preLoadMapSource = async (map: Map) => {
  const imgMap: any = {
    farmIcon: { url: 'skchain/farm.png' },
    blackGrid: { url: 'https://wudao.aminer.cn/api/cogview/get-image/f9090f5c4679e5f0/1653632448178/6.jpg' },
    clay: { url : 'https://wudao.aminer.cn/api/cogview/get-image/f9090f5c4679e5f0/1653632448178/1.jpg'}
  };
  await Promise.all(
    Object.keys(imgMap).map((key) => {
      return new Promise((reslove, reject) => {
        const item = imgMap[key];
        map.loadImage(item.url, (e, res) => {
          if (e) {
            console.error('load img', item.url, 'err:', e);
          }
          map.addImage(key, res as ImageBitmap);
          reslove(true);
        });
      });
    }),
  );
};
