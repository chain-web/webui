import { Button, Tabs } from 'antd';
import { Chat } from '../../../chat';
import TestPage from '../../../test';
import GridDrawer from '../GridDrawer';
import './index.scss';
import { Contract as CtrClass } from '../../contract/index';
import CtrCode from '../../contract/index.contract';
import { DeployContract } from '../../../test/components/contract/DeployContract';
import { TestContract } from '../../../test/components/contract/TestContract';
import { contractAddressKey } from '../../contract/mapContract';
import { mapDb } from '../../map.db';

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
            onSuccess={(trans) => {
              localStorage.setItem(contractAddressKey, trans.recipient.did);
            }}
          />
          <TestContractComp />
          <TestPage />
        </TabPane>
        <TabPane forceRender tab="home" key="home" className="tabbar-item-box">
          <Button
            onClick={async () => {
              const data = mapDb.trans.toArray();
              console.log(data);
            }}
          >
            getMapDb
          </Button>
          <Button
            onClick={async () => {
              const data = await mapDb.trans
                .where('ts')
                .below(Date.now())
                .delete();
              console.log('delete', data);
            }}
          >
            clear mapDb.trans
          </Button>
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
