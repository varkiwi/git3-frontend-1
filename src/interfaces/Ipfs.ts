export interface IpfsBufferResult {
  cid: object;
  path: string;
  size: number;
}

export interface IpfsData {
  done: boolean;
  value: Uint8Array;
}
