// stockdata.org app token = RamgPwgAcspYJX9SidkgGi2vtsrXoKmM2115G1fr
// andrew's stockdata.org app token? =

// this is where we go when a user logs in / signs up
// will include:
// form for user to add a new position
// table of all user positions
// etc.

//attempting to set up mui
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
//
import Row from "../components/Row";
//other imports
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import { REMOVE_POSITION } from "../utils/mutations";
import { SAVE_POSITION } from "../utils/mutations";
import symbols from "../data/symbolObject.js";
import Auth from "../utils/auth";
import uuid from "uuid/v1";
const Dashboard = () => {
  const { loading, data } = useQuery(QUERY_USER);
  /* NOTE: Do we need this? */
  // const [loggedIn, setLoggedIn] = useState(Auth.loggedIn());

  const [removePosition, { err }] = useMutation(REMOVE_POSITION);
  const [savePosition, { error }] = useMutation(SAVE_POSITION);
  const [showAlert, setShowAlert] = useState("");
  const [userPositions, setUserPositions] = useState(
    data ? data.user.positions : []
  );
  const [date, setDate] = useState("");
  const [userFormData, setUserFormData] = useState({
    purchasePrice: 0.0,
    symbol: "",
    purchaseQty: 0.0,
  });

  const userData = data?.user || "userData not found";
  useEffect(() => {
    //TODO: more logic will go into this
    if (data && data.user) {
      setUserPositions(data.user.positions);
    }
  }, [data]);

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  console.log(userData);
  /********************** Handle position functions **********************/

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleCalanderChange = async (event) => {
    const dateString = event.$d.toLocaleString().split(",")[0];

    setDate(dateString);
  };

  const validateFormData = () => {
    let errorMsg = "please enter a valid ";
    const errs = [];
    if (!date) {
      errs.push("date");
    }
    if (!symbols[userFormData.symbol.toUpperCase()]) {
      errs.push("symbol");
    }
    if (
      !parseFloat(userFormData.purchasePrice) ||
      parseFloat(userFormData.purchasePrice) < 0
    ) {
      errs.push("purchase price");
    }
    if (
      !parseFloat(userFormData.purchaseQty) ||
      parseFloat(userFormData.purchaseQty) < 0
    ) {
      errs.push("purchase quantity");
    }
    if (errs.length > 0) {
      setShowAlert((errorMsg += errs.join(", ")));
      return false;
    }
    return true;
  };
  const handleAddPositionSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formValidation = validateFormData();
    if (form.checkValidity() === false || !formValidation) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    try {
      setShowAlert("");
      const { data } = await savePosition({
        variables: {
          positionId: uuid(),
          purchaseDate: date,
          symbol: userFormData.symbol.toUpperCase(),
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

  const handleRemovePosition = async (positionId) => {
    try {
      const { data } = await removePosition({
        variables: { positionId },
      });
    } catch (e) {
      console.error(e);
    }
  };

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
        <form onSubmit={handleAddPositionSubmit}>
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
            style={{ marginBottom: "-3px" }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                name="purchaseDate"
                value={userFormData.purchaseDate}
                onChange={handleCalanderChange}
                label="Purchase Date"
              />
            </DemoContainer>
          </LocalizationProvider>

          {showAlert && <Alert severity="error">{showAlert}</Alert>}
          <Button type="submit" variant="contained" color="primary">
            Add Position
          </Button>
        </form>
      </Box>

      {/****************************** table ****************************/}
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="right">Symbol &nbsp;</TableCell>
              <TableCell align="right">Qty &nbsp;</TableCell>
              <TableCell align="right">Purchase Date &nbsp;</TableCell>
              <TableCell align="right">Purchase Price &nbsp;</TableCell>
              <TableCell align="right">Amount Invested &nbsp;</TableCell>
              <TableCell align="right">Current Price &nbsp;</TableCell>
              <TableCell align="right">% gain/loss &nbsp;</TableCell>
              <TableCell align="right">$ gain/loss &nbsp;</TableCell>
              <TableCell align="right">remove &nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userPositions &&
              userPositions.map((position) => (
                <Row
                  handleRemovePosition={handleRemovePosition}
                  key={position.positionId}
                  position={position}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
