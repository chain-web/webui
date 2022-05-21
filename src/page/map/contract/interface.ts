export interface GridItemData {
  id: string;
  owner: string;
  level: number;
  uTime: number;
  type?: string;
}

export enum GridType {
  'clay' = 'clay',
  'coal' = 'coal',
  'bricks' = 'bricks',
}

export interface UserData {
  rs: {
    coin: BigInt;
    clay: BigInt;
    coal: BigInt;
    bricks: BigInt;
  };
}