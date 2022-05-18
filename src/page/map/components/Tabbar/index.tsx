import { Tabs } from 'antd';
import { Chat } from '../../../chat';
import TestPage from '../../../test';
import GridDrawer from '../GridDrawer';
import './index.scss';
import CtrClass from '../../contract/index';
import CtrCode from '../../contract/index.contract';
import { DeployContract } from '../../../test/components/contract/DeployContract';

export const contractAddressKey = 'map-contract-address';

const TabPane = Tabs.TabPane;
const DeployContractComp = DeployContract(CtrClass, CtrCode);
export default function Tabbar() {
  return (
    <div className="tabbar-box">
      <Tabs tabPosition={'bottom'} defaultActiveKey="home">
        <TabPane tab="home" key="home" className="tabbar-item-box">
          <DeployContractComp
            onSuccess={(account) => {
              localStorage.setItem(contractAddressKey, account.account);
            }}
          />
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
          <TestPage />
        </TabPane>
        <TabPane forceRender className="tabbar-item-box" tab="chat" key="chat">
          <Chat />
        </TabPane>
      </Tabs>
    </div>
  );
}
