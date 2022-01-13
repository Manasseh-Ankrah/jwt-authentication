import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import "./App.css";
import { useStateValue } from "./State/StateProvider";
import NotFound from "./NotFound";

function App() {
  const [{ userToken, user }, dispatch] = useStateValue();

  console.log(userToken, user);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      const tokenResponse = await axios.post(
        "http://localhost:5000/user/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );

      console.log(tokenResponse.data);

      if (tokenResponse.data) {
        const userRes = await axios.get("http://localhost:5000/user/", {
          headers: { "x-auth-token": token },
        });

        dispatch({
          type: "GET_CURRENT_USER",
          item: {
            userToken: token,
            user: userRes.data,
          },
        });
      }
    };
    checkLoggedIn();
  }, []);

  // const navigate = useNavigate();
  // const PrivateRoute = ({ element: Element, ...rest }) => (
  //   <Route
  //     {...rest}
  //     render={(props) => (user ? <Element {...props} /> : navigate("/"))}
  //   />
  // );

  let token = localStorage.getItem("auth-token");
  console.log(token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        {/* <Route exact path="/upcoming/:user" element={<Upcoming />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
