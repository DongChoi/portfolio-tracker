import React, { useState, useEffect } from "react";
// import form dependencies from mui
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import Dashboard from "../pages/Dashboard";

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [login, { error }] = useMutation(LOGIN_USER);

  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: { ...userFormData },
      });
      console.log(data);
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    setUserFormData({
      username: "",
      email: "",
    });
  };

  return (
    <div>
      {Auth.loggedIn() ? (
        <Dashboard />
      ) : (
        <Box
          margin={25}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              value={userFormData.username}
              onChange={handleInputChange}
              style={{ marginBottom: "5px" }}
            />
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              value={userFormData.password}
              onChange={handleInputChange}
              style={{ marginBottom: "5px" }}
            />
            {showAlert && (
              <Alert severity="error">
                An error occurred. Please try again.
              </Alert>
            )}
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </form>
          <Typography variant="body2" align="center" mt={2}>
            Not a user?{" "}
            <Link href="/signup" color="primary">
              Sign up instead.
            </Link>
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default LoginForm;
