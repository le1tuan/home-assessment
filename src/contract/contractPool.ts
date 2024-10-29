import { Contract } from 'ethers'
import PoolAbi from '@/abi/aavePoolAbi.json';
import { getProvider } from './connectContract';

export type ReserveListItem = {
  symbol: string;
  address: string;
}

let contractPool: Contract | null = null;

export async function connectPoolContract() {
  try {
    if (contractPool) {
      return;
    }
    const provider = await getProvider();
    const address = (import.meta as any).env.VITE_POOL_CONTRACT_ADDRESS;
    contractPool = new Contract(address, PoolAbi, provider)

    return contractPool;
  } catch (error) {
    throw new Error(`Can not connect to Pool contract:  ${(error as any)?.message}`)
  }
}

export async function getReserveData(assetAddress: string) {
  try {
    if (!contractPool) {
      throw new Error('Please connect to Pool contract first')
    }
    if (!assetAddress) {
      throw new Error('Please provide asset address')
    }
    const parseAssetAddress = assetAddress.trim();
    const reserveData = await contractPool.getReserveData(parseAssetAddress);
    return reserveData;
  } catch (error) {
    throw new Error(`Can not get reserve data:  ${(error as any)?.message}`)
  }
}

export async function getReserveList(): Promise<Array<ReserveListItem>> {
  try {
    if (!contractPool) {
      throw new Error('Please connect to Pool contract first')
    }
    const reserveData = await contractPool.getAllReservesTokens();
    return reserveData.map((data: Array<string>) => {
      const [symbol, address] = data;
      return {
        symbol,
        address
      }
    });
  } catch (error) {
    throw new Error(`Can not get reserve list data:  ${(error as any)?.message}`)
  }
}