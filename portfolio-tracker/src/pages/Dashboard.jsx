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
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
//
import axios from "axios";
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
  const [stockData, setStockData] = useState({});
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
    async function fetchPositionsOnMount() {
      //TODO: more logic will go into this
      const positionSymbols = data.user.positions.map((position) => {
        return position.symbol;
      });
      const uniqueSymbols = [...new Set(positionSymbols)];
      const joinedSymbolString = uniqueSymbols.join(",");
      //call api
      //put token to env
      const positionsData = await axios.get(
        `https://api.stockdata.org/v1/data/quote?symbols=${joinedSymbolString}&api_token=RamgPwgAcspYJX9SidkgGi2vtsrXoKmM2115G1fr`
      );
      /*const sample = {
        "52_week_high": 176.39,
        "52_week_low": 124.17,
        currency: "USD",
        day_change: 0.64,
        day_high: 173.89,
        day_low: 171.7,
        day_open: 172.54,
        exchange_long: "NASDAQ Stock Exchange",
        exchange_short: "NASDAQ",
        is_extended_hours_price: false,
        last_trade_time: "2023-05-25T15:59:59.000000",
        market_cap: 2720907919360,
        mic_code: "XNAS",
        name: "Apple Inc",
        previous_close_price: 171.88,
        previous_close_price_time: "2023-05-24T15:59:59.000000",
        price: 172.99,
        ticker: "AAPL",
        volume: 1015321,
      };*/
      const restructuredStockData = positionsData.data.data.reduce(
        (acc, stock) => {
          if (acc[stock.ticker] === undefined) {
            acc[stock.ticker] = stock;
          }
          return acc;
        },
        {}
      );
      console.log("restructured stock data", restructuredStockData);
      setUserPositions(data.user.positions);
      setStockData(restructuredStockData);
    }
    if (data && data.user && data.user.positions.length > 0) {
      fetchPositionsOnMount();
    }
  }, [data]);

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // console.log(userData);
  /********************** Handle position functions **********************/

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  /****************************** calendar logic ******************************/
  const handleCalendarChange = async (event) => {
    const dateString = event.$d.toLocaleString().split(",")[0];

    setDate(dateString);
  };

  /******************************** form logic ********************************/
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
    /* //please uncomment this if you want to limit users to put data from only 1 year back from now
    const today = new Date();
    const targetDate = new Date("05/26/2022"); // Example target date

    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );

    if (targetDate < oneYearAgo) {
      err.push("date. sorry, we only allow only one year to the past! D:")
    }
    */
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
                value={date}
                onChange={handleCalendarChange}
                label="Purchase Date"
                // minDate={dayjs().subtract(1, "year")}
                disableFuture
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
              <TableCell align="right">Symbol &nbsp;</TableCell>
              <TableCell align="right">Purchase Date &nbsp;</TableCell>
              <TableCell align="right">Qty &nbsp;</TableCell>
              <TableCell align="right">Amount Invested &nbsp;</TableCell>
              <TableCell align="right">Purchase Price &nbsp;</TableCell>
              <TableCell align="right">Current Price &nbsp;</TableCell>
              <TableCell align="right">% gain/loss &nbsp;</TableCell>
              <TableCell align="right">$ gain/loss &nbsp;</TableCell>
              <TableCell align="right">remove &nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userPositions &&
              stockData &&
              userPositions.map((position) => (
                <Row
                  handleRemovePosition={handleRemovePosition}
                  key={position.positionId}
                  position={position}
                  stockData={stockData[position.symbol]}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
