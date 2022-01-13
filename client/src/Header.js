import { Button } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Header.css";
import { useStateValue } from "./State/StateProvider";

function Header() {
  const [{ userToken, user }, dispatch] = useStateValue();
  const history = useNavigate();

  const Logout = () => {
    dispatch({
      type: "GET_CURRENT_USER",
      item: {
        userToken: "",
        user: {},
      },
    });
    localStorage.setItem("auth-token", "");

    history("/");
  };
  return (
    <div className="header">
      <div className="header__logout">
        <Button onClick={Logout} className="header__logout__btn">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Header;
