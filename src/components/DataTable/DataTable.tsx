import { ReserveListItem } from '@/contract';
import React, { useContext } from 'react';
import Big from 'big.js';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ErrorContext } from '@/context/ErrorContext';
import { LoadingContext } from '@/context/LoadingContext';

type Props = {
  reserveData: Array<ReserveData>,
  latestFetched: number
}

type ReserveData = ReserveListItem & {
  variableBorrowRate: number | string
}

export const DataTable = ({
  reserveData,
  latestFetched,
}: Props) => {

  const { setError } = useContext(ErrorContext);
  const { setLoading } = useContext(LoadingContext);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}
    >
      <Typography gutterBottom variant="h4" sx={{
        textAlign: 'center'
      }}>AAVE Borrow Rate Data</Typography>
      {
        latestFetched ? (
          <Typography
            gutterBottom
          >
            Latest Updated: {new Date(latestFetched).toLocaleDateString("en-Us", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })}
          </Typography>
        ) : null
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
                const borrowRate = data?.variableBorrowRate ? (data?.variableBorrowRate * 100).toFixed(3) : 0
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