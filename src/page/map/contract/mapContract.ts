import BigNumber from 'bignumber.js';
import { SKChain } from 'sk-chain';
import { Contract } from '.';
import { skService } from '../../../state/sk.state';
export const contractAddressKey = 'map-contract-address';
interface ContractOptions {
  amount?: BigNumber;
}

export const createContractService = <T>(
  address: string,
  chain: SKChain,
  opts?: ContractOptions,
) => {
  const contractService = new Proxy(
    {},
    {
      get(_obj, mothed: string) {
        return (...arg: any) => {
          chain.transaction({
            recipient: address,
            amount: opts?.amount || new BigNumber(0),
            payload: {
              mothed,
              args: [...arg],
            },
          });
        };
      },
    },
  ) as T;

  return contractService;
};

export const mapContract = createContractService<Contract>(
  localStorage.getItem(contractAddressKey)!,
  skService.state.context.chain.sk,
);
