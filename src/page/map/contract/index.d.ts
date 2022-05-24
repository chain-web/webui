import { GridType } from './interface';
declare const Base: typeof BaseContract;
export declare class Contract extends Base {
    constructor();
    private userDb;
    private gridDb;
    static levelBase: number;
    toOwn: (hexid: string) => void;
    changeGridType: (hexid: string, type: GridType) => boolean;
    levelUp: (did: string) => void;
    private checkLevelDown;
}
declare class Address {
    did: string;
}
declare class BaseContract {
    msg: {
        sender: Address;
        ts: number;
    };
}
export {};
