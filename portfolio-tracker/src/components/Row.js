import { IconButton, TableCell, TableRow, Collapse } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function Row(props) {
  const { position, handleRemovePosition } = props;
  const [open, setOpen] = useState(false);

  function handleRemoveClick(positionId) {
    handleRemovePosition(positionId);
  }
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {position.symbol}
        </TableCell>
        <TableCell align="right">{position.purchaseQty}</TableCell>
        <TableCell align="right">{position.purchaseDate}</TableCell>
        <TableCell align="right">{position.purchasePrice}</TableCell>
        <TableCell align="right">
          {position.purchasePrice * position.purchaseQty}
        </TableCell>
        <TableCell align="right">{"row.currentPrice"}</TableCell>
        <TableCell align="right">{"row.gainloss%"}</TableCell>
        <TableCell align="right">{"row.gainloss$"}</TableCell>
        <TableCell
          align="right"
          onClick={() => {
            handleRemoveClick(position.positionId);
          }}
        >
          X
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
