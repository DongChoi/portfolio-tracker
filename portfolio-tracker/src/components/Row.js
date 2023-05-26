import { IconButton, TableCell, TableRow, Collapse } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function Row({ position, handleRemovePosition, stockData }) {
  const [open, setOpen] = useState(false);
  function handleRemoveClick(positionId) {
    handleRemovePosition(positionId);
  }
  const purchaseQty = position.purchaseQty;
  const purchaseDate = position.purchaseDate;
  const purchasePrice = position.purchasePrice;
  const currentPrice = stockData.price;
  const totalInvested = purchaseQty * purchasePrice;
  const gainLossDollars = (currentPrice - purchasePrice) * purchaseQty;
  const gainOrLoss = gainLossDollars > 0 ? true : false;
  const gainLossPercentage = ((currentPrice - purchasePrice) / purchasePrice) * 100;
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {/* future implementation for getting a graph for api call */}
        {/* <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell> */}
        <TableCell component="th" scope="row">
          {position.symbol}
        </TableCell>
        <TableCell align="right">{purchaseDate}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="right">{purchaseQty}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="right">{totalInvested}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="right">{purchasePrice}&nbsp;&nbsp;&nbsp;</TableCell>
        <TableCell align="right">{currentPrice}&nbsp; &nbsp;&nbsp;</TableCell>
        <TableCell
          style={gainOrLoss ? { color: "green" } : { color: "red" }}
          align="right"
        >
          {gainLossDollars > 0
            ? gainLossPercentage.toFixed(4)
            : (100 - gainLossPercentage).toFixed(4)}
          % &nbsp;
        </TableCell>
        <TableCell
          style={gainOrLoss ? { color: "green" } : { color: "red" }}
          align="right"
        >
          {gainLossDollars.toFixed(4)}&nbsp;
        </TableCell>
        <TableCell align="right">
          <button
            onClick={() => {
              handleRemoveClick(position.positionId);
            }}
            style={{ backgroundColor: "white", border: "0px" }}
          >
            X&nbsp;&nbsp;&nbsp;&nbsp;
          </button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/* <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                          {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.customerId}</TableCell>
                        <TableCell align="right">{historyRow.amount}</TableCell>
                        <TableCell align="right">
                          {Math.round(historyRow.amount * row.price * 100) /
                            100}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box> */}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
