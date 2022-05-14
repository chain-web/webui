import { Map } from 'mapbox-gl';
import { isMobile } from '../../config';
import { MapEventType, mapService } from './map.state';

export class MapAction {
  constructor(map: Map) {
    this.map = map;
    this.init();
  }
  map: Map;
  clearMap = {
    source: '',
    fill: '',
  };

  init = async () => {};

  bindClickEvent = async () => {
    this.map.on('click', async (e) => {
      // console.log(e.lngLat);

      const hex = await mapService.state.context.hexService.genHexByLngLat(
        e.lngLat,
      );
      // console.log(hex);
      const id = hex.hexid;
      if (this.clearMap.fill) {
        this.map.removeLayer(this.clearMap.fill);
        this.clearMap.fill = '';
      }
      if (this.clearMap.source) {
        this.map.removeSource(this.clearMap.source);
        this.clearMap.source = '';
      }
      this.map.addSource(id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [hex].map((ele) => {
                  return [...ele.polygon, ele.polygon[0]];
                }),
              },
            },
          ],
        },
      });
      const fillId = `active-${id}-fills`;
      this.map.addLayer({
        id: fillId,
        type: 'fill',
        source: id,
        layout: {},
        paint: {
          'fill-outline-color': '#927BC1',
          'fill-color': '#627BC1',
          'fill-opacity': 0.9,
        },
      });
      this.clearMap.source = id;
      this.clearMap.fill = fillId;
      // border
      // map.addLayer({
      //   id: `active-${id}-border`,
      //   type: 'line',
      //   source: id,
      //   layout: {},
      //   paint: {
      //     'line-color': '#927BC1',
      //     'line-width': 1,
      //   },
      // });
      // 贴图
      // map.addLayer({
      //   id: `${id}-pattern`,
      //   type: 'fill',
      //   source: id,
      //   paint: {
      //     'fill-pattern': 'farmIcon',
      //     // 'fill-opacity': Math.random(),
      //     'fill-opacity': 1,
      //   },
      // });
      mapService.send(MapEventType.UPDATE_GRID, {
        data: { showGridDetail: true, activeHex: hex },
      });
    });
  };

  // 添加默认的hover层，仅在pc下添加
  addDefaultHexLayer = async (LngLat: number[]) => {
    const list = await mapService.state.context.hexService.genCurHex(LngLat);
    if (isMobile) {
      return;
    }
    if (!this.map.isStyleLoaded()) {
      // 确保map的资源已经加载完成，不然addSource会失败
      await new Promise((reslove) => {
        setTimeout(() => {
          this.addDefaultHexLayer(LngLat).then(() => {
            reslove(1);
          })
        }, 100);
      })
      return;
    }
    const id = 'defaultHexLayer';
    this.map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: list.map((ele: any) => {
          return {
            type: 'Feature',
            id: ele.hexid
              .replace(/B/g, '')
              .replace(/C/g, '')
              .replace(/M/g, '')
              .replace('x', '')
              .replace('y', ''),
            properties: { center: ele.center, id: ele.hexid },
            geometry: {
              type: 'Polygon',
              coordinates: [ele.polygon],
            },
          };
        }),
      },
    });
    this.map.addLayer({
      id: `${id}-fills`,
      type: 'fill',
      source: id,
      layout: {},
      paint: {
        // 'fill-outline-color': '#927BC1',
        'fill-color': '#627BC1',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.75,
          0.08,
        ],
      },
    });
    let hoveredStateId: any = null;
    // 鼠标移入
    this.map.on('mousemove', `${id}-fills`, (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredStateId !== null) {
          this.map.setFeatureState(
            { source: id, id: hoveredStateId },
            { hover: false },
          );
        }
        // 如果当前地块儿有内容，就高亮
        // 仅pc有用
        hoveredStateId = e.features[0].id;
        this.map.setFeatureState(
          { source: id, id: hoveredStateId },
          { hover: true },
        );
      }
    });
    // 鼠标移出
    this.map.on('mouseleave', `${id}-fills`, () => {
      if (hoveredStateId !== null) {
        this.map.setFeatureState(
          { source: id, id: hoveredStateId },
          { hover: false },
        );
      }
      hoveredStateId = null;
    });
  };
}
