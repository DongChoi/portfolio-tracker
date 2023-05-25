// stockdata.org app token = RamgPwgAcspYJX9SidkgGi2vtsrXoKmM2115G1fr
// andrew's stockdata.org app token? =

// this is where we go when a user logs in / signs up
// will include:
// form for user to add a new position
// table of all user positions
// etc.

//attempting to set up mui
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
//forms to add and remove positions

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
//other imports
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import { REMOVE_POSITION } from "../utils/mutations";
import { SAVE_POSITION } from "../utils/mutations";
import Auth from "../utils/auth";
import uuid from 'uuid/v1'

const Dashboard = () => {
  const { loading, data } = useQuery(QUERY_USER);
  const [loggedIn, setLoggedIn] = useState(Auth.loggedIn());
  //TODO
  const [removePosition, { err }] = useMutation(REMOVE_POSITION);
  const [savePosition, { error }] = useMutation(SAVE_POSITION);
  const [userPositions, setUserPositions] = useState([]);
  const [date, setDate] = useState("");
  const [userFormData, setUserFormData] = useState({
    purchasePrice: 0.0,
    symbol: "",
    purchaseQty: 0.0,
  });

  const userData = data?.user || "userData not found";
  console.log("userData", userData);

  /********************** Handle position functions **********************/

  // function handleRemovePositionFormSubmit() {}

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleCalanderChange = async (event) => {
    const dateString = event.$d.toLocaleString().split(",")[0];

    setDate(dateString);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await savePosition({
        variables: {
          positionId: uuid(),
          purchaseDate: date,
          symbol: userFormData.symbol,
          purchasePrice: parseFloat(userFormData.purchasePrice),
          purchaseQty: parseFloat(userFormData.purchaseQty),
        },
      });
    } catch (e) {
      console.error(e);
    }

    setUserFormData({
      purchasePrice: 0.0,
      symbol: "",
      purchaseQty: 0.0,
    });
  };

  useEffect(() => {
    return () => setUserPositions(userData.positions);
  }, [userPositions, userData.positions]);

  const handleRemovePosition = async (positionId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      const { data } = await removePosition({
        variables: { positionId },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePosition = async (userFormInput) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      const { data } = await savePosition({
        variables: { userFormInput },
      });
      setUserPositions(userData.positions);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // function Row(props: { row: ReturnType<typeof createData> }) {
  //   const { row } = props;
  //   const [open, setOpen] = React.useState(false);
  // //   do calculations...
  //        //(currentprice/purchaseprice) * amount invested
  //   return (
  //     <React.Fragment>
  //       <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
  //         <TableCell>
  //           <IconButton
  //             aria-label="expand row"
  //             size="small"
  //             onClick={() => setOpen(!open)}
  //           >
  //             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
  //           </IconButton>
  //         </TableCell>
  //         <TableCell component="th" scope="row">
  //           {row.name}
  //         </TableCell>
  //         <TableCell align="right">{row.calories}</TableCell>
  //         <TableCell align="right">{row.fat}</TableCell>
  //         <TableCell align="right">{row.carbs}</TableCell>
  //         <TableCell align="right">{row.protein}</TableCell>
  //       </TableRow>
  //       <TableRow>
  //         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
  //           <Collapse in={open} timeout="auto" unmountOnExit>
  //             <Box sx={{ margin: 1 }}>
  //               <Typography variant="h6" gutterBottom component="div">
  //                 History
  //               </Typography>
  //               <Table size="small" aria-label="purchases">
  //                 <TableHead>
  //                   <TableRow>
  //                     <TableCell>Date</TableCell>
  //                     <TableCell>Customer</TableCell>
  //                     <TableCell align="right">Amount</TableCell>
  //                     <TableCell align="right">Total price ($)</TableCell>
  //                   </TableRow>
  //                 </TableHead>
  //                 <TableBody>
  //                   {row.history.map((historyRow) => (
  //                     <TableRow key={historyRow.date}>
  //                       <TableCell component="th" scope="row">
  //                         {historyRow.date}
  //                       </TableCell>
  //                       <TableCell>{historyRow.customerId}</TableCell>
  //                       <TableCell align="right">{historyRow.amount}</TableCell>
  //                       <TableCell align="right">
  //                         {Math.round(historyRow.amount * row.price * 100) /
  //                           100}
  //                       </TableCell>
  //                     </TableRow>
  //                   ))}
  //                 </TableBody>
  //               </Table>
  //             </Box>
  //           </Collapse>
  //         </TableCell>
  //       </TableRow>
  //     </React.Fragment>
  //   );
  // }

  return (
    <div>
      {/* form to add and remove positions */}
      <Box
        mx={25}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <TextField
            required
            fullWidth
            label="Symbol"
            name="symbol"
            value={userFormData.symbol}
            onChange={handleInputChange}
            placeholder="symbol"
            style={{ marginBottom: "5px" }}
          />
          <TextField
            required
            fullWidth
            label="Qty"
            name="purchaseQty"
            value={userFormData.purchaseQty}
            onChange={handleInputChange}
            style={{ marginBottom: "5px" }}
          />
          <TextField
            required
            fullWidth
            label="Purchase Price"
            name="purchasePrice"
            value={userFormData.purchasePrice}
            onChange={handleInputChange}
            style={{ marginBottom: "5px" }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                name="purchaseDate"
                value={userFormData.purchaseDate}
                onChange={handleCalanderChange}
                label="Basic date picker"
              />
            </DemoContainer>
          </LocalizationProvider>

          {/* {showAlert && (
            <Alert severity="error">An error occurred. Please try again.</Alert>
          )} */}
          <Button type="submit" variant="contained" color="primary">
            Add Position
          </Button>
        </form>
        {/* <Typography variant="body2" align="center" mt={2}>
          Already a User?{" "}
          <Link href="/" color="primary">
            Login instead.
          </Link>
        </Typography> */}
      </Box>

      {/****************************** table ****************************/}
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Purchase Date</TableCell>
              <TableCell align="right">Purchase Price &nbsp;</TableCell>
              <TableCell align="right">Amount Invested &nbsp;</TableCell>
              <TableCell align="right">Current Price &nbsp;</TableCell>
              <TableCell align="right">% gain/loss &nbsp;</TableCell>
              <TableCell align="right">$ gain/loss &nbsp;</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {userPositions.map((position) => (
              <Row key={position.name} position={position} />
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
