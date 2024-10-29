import { JsonRpcProvider } from 'ethers'

let provider: JsonRpcProvider | null = null;

export async function connectProvider() {
  try {
    const url = (import.meta as any).env.VITE_RPC_URL
    provider = new JsonRpcProvider(url);
    return provider
  } catch (error) {
    throw new Error(`Can not connect to Provider:  ${(error as any)?.message}`)
  }
}


export async function getProvider() {
  if (provider) {
    return provider
  }

  return await connectProvider();
}