import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Alert, Button, Divider, Paper, Typography } from "@mui/material";
import Header from "./Header";
import { useStateValue } from "./State/StateProvider";
import Logo from "./images/ncc_logo.png";
// import ErrorNotice from "./ErrorNotice";
import "./css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [{ userToken, user }, dispatch] = useStateValue();
  const history = useNavigate();

  useEffect(() => {
    if (user.displayName) {
      history("/home");
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Enter Login Credentials");
    } else {
      try {
        const loginUser = { email, password };
        const loginResponse = await axios
          .post("http://localhost:5000/user/login", loginUser)
          .then((res) => {
            dispatch({
              type: "GET_CURRENT_USER",
              item: {
                userToken: res.data.token,
                user: res.data.user,
              },
            });
            localStorage.setItem("auth-token", res.data.token);
          })
          .catch((err) =>
            alert("No account has been created with these credentials")
          );

        // console.log(loginResponse);
        console.log(userToken, user);

        history("/home");
      } catch (err) {
        console.log(err);
        setEmail("");
        setPassword("");
      }
    }
  };

  return (
    <div className="login">
      <Paper className="login__card" elevation={3}>
        <div className="login__container">
          <Typography className="login__text" variant="h5" component="h5">
            Results Checker
          </Typography>
          <Divider />

          <img src={Logo} alt="logo" />

          <div className="login__form">
            <TextField
              className="email"
              required={true}
              id="outlined"
              label="Email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              className="pass"
              id="outlined-password-input"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              className="login__btn"
              variant="contained"
              style={{
                marginTop: 20,
                width: 200,
                height: 50,
              }}
              onClick={submit}
            >
              Login
            </Button>
            <p className="login__text__register">
              Don't have an account ? ... <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </Paper>
    </div>
  );
}
export default Login;
