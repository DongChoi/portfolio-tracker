import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [addUser, { error }] = useMutation(ADD_USER);

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
      const { data } = await addUser({
        variables: { ...userFormData },
      });
      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }

    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };
  return (
    <div>
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
            label="Email"
            name="email"
            value={userFormData.email}
            onChange={handleInputChange}
            style={{ marginBottom: "5px" }}
          />
          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={userFormData.password}
            onChange={handleInputChange}
            style={{ marginBottom: "5px" }}
          />
          {showAlert && (
            <Alert severity="error">An error occurred. Please try again.</Alert>
          )}
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" align="center" mt={2}>
          Already a User?{" "}
          <Link href="/" color="primary">
            Login instead.
          </Link>
        </Typography>
      </Box>
    </div>
  );
};

export default SignupForm;
