import { Tabs } from 'antd';
import { Chat } from '../../../chat';
import TestPage from '../../../test';
import GridDrawer from '../GridDrawer';
import './index.scss';
import { Contract as CtrClass } from '../../contract/index';
import CtrCode from '../../contract/index.contract';
import { DeployContract } from '../../../test/components/contract/DeployContract';
import { TestContract } from '../../../test/components/contract/TestContract';
import { contractAddressKey } from '../../contract/mapContract';

const TabPane = Tabs.TabPane;
const DeployContractComp = DeployContract(CtrClass, CtrCode);
const TestContractComp = TestContract(CtrClass, CtrCode);
export default function Tabbar() {
  return (
    <div className="tabbar-box">
      <Tabs tabPosition={'bottom'} defaultActiveKey="node">
        <TabPane
          forceRender
          style={{ overflow: 'auto' }}
          className="tabbar-item-box"
          tab="node"
          key="node"
        >
          <DeployContractComp
            onSuccess={(account) => {
              localStorage.setItem(contractAddressKey, account.account.did);
            }}
          />
          <TestContractComp />
          <TestPage />
        </TabPane>
        <TabPane forceRender tab="home" key="home" className="tabbar-item-box">
          <div id="map-container" />
          <GridDrawer />
        </TabPane>

        <TabPane forceRender className="tabbar-item-box" tab="chat" key="chat">
          <Chat />
        </TabPane>
      </Tabs>
    </div>
  );
}
