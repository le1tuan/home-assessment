import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { ReserveData } from './page/ReserveData'
import { Box } from '@mui/material';
import { WalletContext } from './context/WalletContext';
import { useWallet } from './hook/useWallet';
import { useError } from './hook/useError';
import { ErrorContext } from './context/ErrorContext';
import { LoadingContext } from './context/LoadingContext';
import { useLoading } from './hook/useLoading';

function App() {
  const { error, setError } = useError();
  const { currentAccount, handleConnect } = useWallet({ setError });
  const { loading, setLoading } = useLoading();


  return (
    <>
      <ErrorContext.Provider
        value={{
          error: error,
          setError: setError
        }}
      >
        <LoadingContext.Provider
          value={{
            setLoading,
            loading
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
              />
            </Box>
          </WalletContext.Provider>
        </LoadingContext.Provider>
      </ErrorContext.Provider>
    </>
  )
}

export default App
