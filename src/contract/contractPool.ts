import { Contract } from 'ethers'
import PoolAbi from '@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json'
import { getProvider } from './connectContract';

let contractPool: Contract | null = null;

export async function connectPoolContract() {
  try {
    const provider = await getProvider();
    const address = import.meta.env.VITE_POOL_CONTRACT_ADDRESS;
    contractPool = new Contract(address, PoolAbi.abi, provider)

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
    const reserveData = await contractPool.getReserveData(parseAssetAddress)
    return reserveData;
  } catch (error) {
    throw new Error(`Can not get reserve data:  ${(error as any)?.message}`)
  }
}

export async function getReserveList() {
  try {
    if (!contractPool) {
      throw new Error('Please connect to Pool contract first')
    }
    const reserveData = await contractPool.getReservesList()
    return reserveData;
  } catch (error) {
    throw new Error(`Can not get reserve list data:  ${(error as any)?.message}`)
  }
}