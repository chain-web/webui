import { Map } from 'mapbox-gl';
// import {
//   MeshBasicMaterial,
//   TextureLoader,
//   Mesh,
//   Shape,
//   ShapeGeometry,
// } from 'three';
// import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// export const imgMap = {
//   farm: { url: 'farm.png', data: null, loader: TextureLoader, obj3d: null },
// };

// export const preLoad = async () => {
//   await Promise.all(
//     Object.keys(imgMap).map((key) => {
//       return new Promise((reslove, reject) => {
//         const item = imgMap[key];
//         if (item.loader) {
//           const loader = new item.loader();
//           loader.load(item.url, (data) => {
//             item.data = data;
//             const x = 0,
//               y = 0,
//               r = 10;
//             const heartShape = new Shape();
//             heartShape.moveTo(x, y - r);
//             heartShape.lineTo(x - Math.sqrt(3) / 2, y - r / 2);
//             heartShape.lineTo(x - Math.sqrt(3) / 2, y + r / 2);
//             heartShape.lineTo(x, y + r);
//             heartShape.lineTo(x + Math.sqrt(3) / 2, y + r / 2);
//             heartShape.lineTo(x + Math.sqrt(3) / 2, y - r / 2);
//             heartShape.lineTo(x, y - r);
//             const geometry = new ShapeGeometry(heartShape);
//             const material = new MeshBasicMaterial({
//               map: data,
//             });
//             item.obj3d = new Mesh(geometry.rotateY(0), material);
//           });
//         }
//       });
//     }),
//   );
// };

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
