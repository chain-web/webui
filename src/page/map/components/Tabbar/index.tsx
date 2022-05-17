import { Tabs } from 'antd';
import { Chat } from '../../../chat';
import TestPage from '../../../test';
import { TestContract } from '../../../test/components/contract/TestContract';
import GridDrawer from '../GridDrawer';
import './index.scss';
import CtrClass from '../../contract/index';
import CtrCode from '../../contract/index.contract';

const TabPane = Tabs.TabPane;
const TestContractComp = TestContract(CtrClass, CtrCode);
export default function Tabbar() {
  return (
    <div className="tabbar-box">
      <Tabs tabPosition={'bottom'} defaultActiveKey="home">
        <TabPane tab="home" key="home" className="tabbar-item-box">
          <div id="map-container" />
          <GridDrawer />
        </TabPane>
        <TabPane
          forceRender
          style={{ overflow: 'auto' }}
          className="tabbar-item-box"
          tab="node"
          key="node"
        >
          <TestContractComp />
          <TestPage />
        </TabPane>
        <TabPane forceRender className="tabbar-item-box" tab="chat" key="chat">
          <Chat />
        </TabPane>
      </Tabs>
    </div>
  );
}
