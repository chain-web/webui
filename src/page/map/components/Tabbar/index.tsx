import { Tabs } from 'antd';
import React from 'react';
import GridDrawer from '../GridDrawer';
import './index.scss';

const TabPane = Tabs.TabPane;
export default function Tabbar() {
  return (
    <div className="tabbar-box">
      <Tabs tabPosition={'bottom'} defaultActiveKey="home">
        <TabPane tab="home" key="home" className="tabbar-item-box">
          <div id="map-container" />
          <GridDrawer />
        </TabPane>
        <TabPane className="tabbar-item-box" tab="Tab 2" key="2">
          Content of Tab 2
        </TabPane>
        <TabPane tab="Tab 3" className="tabbar-item-box" key="3">
          Content of Tab 3
        </TabPane>
      </Tabs>
    </div>
  );
}
