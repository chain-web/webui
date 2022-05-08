import { Tabs } from 'antd';
import TestPage from '../../../test';
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
        <TabPane style={{overflow: 'auto'}} className="tabbar-item-box" tab="node" key="node">
          <TestPage />
        </TabPane>
        <TabPane tab="Tab 3" className="tabbar-item-box" key="3">
          Content of Tab 3
        </TabPane>
      </Tabs>
    </div>
  );
}
