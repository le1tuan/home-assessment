import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { connectPoolContract, connectTokenContract, connectProvider, getReserveList } from './contract'
import { ADDRESS_LIST_KEY } from './utils/constants'
import { ReserveData } from './page/ReserveData'
import { Alert, Box, Snackbar } from '@mui/material';
import { WalletContext } from './context/WalletContext';
import { useWallet } from './hook/useWallet';
import { useError } from './hook/useError';
import { ErrorContext } from './context/ErrorContext';

function App() {
  const [listAddress, setListAddress] = useState([]);
  const { error, setError } = useError();
  const { currentAccount, handleConnect } = useWallet({ setError });

  const handleContract = async () => {
    await connectPoolContract();
    const rawSavedList = localStorage.getItem(ADDRESS_LIST_KEY);
    let savedList = rawSavedList ? JSON.parse(rawSavedList) : ''
    if (!savedList) {
      const list = await getReserveList();
      savedList = [...list];
      localStorage.setItem(ADDRESS_LIST_KEY, JSON.stringify(savedList))
    }
    setListAddress(savedList);
  }

  useEffect(() => {
    handleContract();
  }, [])


  return (
    <>
      <ErrorContext.Provider
        value={{
          error: error,
          setError: setError
        }}
      >
        <WalletContext.Provider
          value={{
            currentAccount: currentAccount,
            handleConnect: handleConnect
          }}
        >
          <CssBaseline />
          <Box>
            <ReserveData
              listAddress={listAddress}
            />
          </Box>
        </WalletContext.Provider>
      </ErrorContext.Provider>
    </>
  )
}

export default App
