import { getReserveData } from '@/contract';
import { LATEST_FETCHED_RESERVE_DATA, RESERVE_DATA } from '@/utils/constants';
import { delay } from '@/utils/delay';
import { formatUnits, toBigInt } from 'ethers';
import React, { useEffect, useState } from 'react';
import Big from 'big.js';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { TokenData } from '@/page/ReserveData';
import { convertDateToMinutes } from '@/utils/number';

type Props = {
  tokenSymbol: Array<any>
}

type ReserveData = TokenData & {
  borrowRate: number
}

const FETCH_INTERVAL_MINUTE = 5;

const rawSavedReserveData = localStorage.getItem(RESERVE_DATA);
const rawLatestFetched = localStorage.getItem(LATEST_FETCHED_RESERVE_DATA);

export const DataTable = ({
  tokenSymbol
}: Props) => {

  const [reserveData, setReserveData] = useState(rawSavedReserveData ? JSON.parse(rawSavedReserveData) : []);
  const [latestFetched, setLatestFetched] = useState(rawLatestFetched ? JSON.parse(rawLatestFetched) : '')

  const handleFetchReserveData = async () => {
    try {
      const fetchedReserveData: Array<any> = [];
      const promises = tokenSymbol.map(async (info) => {
        if (info.address) {
          await delay();
          const result = await getReserveData(info.address);
          const borrowRate = new Big(result[4]);
          const RAY_DECIMALS = new Big("1" + "0".repeat(27));
          const currentBorrowRate = borrowRate.div(RAY_DECIMALS);

          return {
            ...info,
            borrowRate: currentBorrowRate.toFixed(5)
          }
        }
      })
      const results = await Promise.allSettled(promises);
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          fetchedReserveData.push(result.value);
        } else {
          // errors.push(result.reason)
          console.log(result.reason)
        }
      })
      const dateNow = JSON.stringify(Date.now());
      localStorage.setItem(RESERVE_DATA, JSON.stringify(fetchedReserveData))
      localStorage.setItem(LATEST_FETCHED_RESERVE_DATA, JSON.stringify(dateNow));
      setReserveData(fetchedReserveData);
      setLatestFetched(dateNow)
    } catch (error) {

    }
  }

  useEffect(() => {
    const savedReserveData = rawSavedReserveData ? JSON.parse(rawSavedReserveData) : '';
    const dateNow = Date.now();
    const duration = convertDateToMinutes(dateNow - (latestFetched || Date.now()));
    console.log("ddd", duration)
    if (tokenSymbol
      && tokenSymbol.length > 0
      && (!savedReserveData || duration > FETCH_INTERVAL_MINUTE)
    ) {
      handleFetchReserveData();
    }
  }, [tokenSymbol])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}
    >
      <Typography gutterBottom variant="h4">AAVE Borrow Rate Data</Typography>
      {
        latestFetched && (
          <Typography
            gutterBottom
          >
            Latest Updated: {new Date(latestFetched).toLocaleDateString("en-Us", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })}
          </Typography>
        )
      }
      <TableContainer component={Paper} sx={{ maxWidth: 850 }}>
        <Table sx={{ minWidth: 450 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{
                maxWidth: 150,
                width: 150
              }}>Token Name</TableCell>
              <TableCell>Token Address</TableCell>
              <TableCell>Current Borrow Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              reserveData.map((data: ReserveData) => {
                const borrowRate = data?.borrowRate ? (data?.borrowRate * 100).toFixed(3) : 0
                return (
                  <TableRow
                    key={data.address}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      component="th" scope="row"
                      sx={{
                        maxWidth: 150,
                        width: 150
                      }}
                    >
                      {data?.symbol}
                    </TableCell>
                    <TableCell>{data?.address}</TableCell>
                    <TableCell>{borrowRate}%</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}