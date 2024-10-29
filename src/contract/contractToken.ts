import { Contract, decodeBytes32String, ethers, isBytesLike } from 'ethers'
import { getProvider } from './connectContract';

const erc20ABI = [
  "function symbol() view returns (string)",
];

// const erc20ABICustom = ["function symbol() view returns (bytes32)"]

export async function connectTokenContract(tokenAddress: string) {
  try {
    const provider = await getProvider();
    const contractToken = new Contract(tokenAddress, erc20ABI, provider)

    return contractToken;
  } catch (error) {
    throw new Error(`Can not connect to Token contract:  ${(error as any)?.message}`)
  }
}

// Function to convert bytes32 to string
function bytes32ToString(bytes: string) {
  return decodeBytes32String(bytes);
}

export async function getSymbol(contractToken: Contract) {
  try {
    if (!contractToken) {
      throw new Error('Please connect to Token contract first')
    }

    try {
      const reserveData = await contractToken.symbol();
      return reserveData
    } catch (error) {
      if ((error?.message || '').indexOf("could not decode result data") === -1) {
        throw new Error(`Can not get symbol Token data:  ${(error as any)?.message}`)
      } else {
        return bytes32ToString(error?.value);
      }
    }

    return null;
  } catch (error) {
    throw new Error(`Can not get symbol Token data:  ${(error as any)?.message}`)
  }
}
