import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useStateValue } from "./State/StateProvider";

function Home() {
  const [{ userToken, user }, dispatch] = useStateValue();
  const history = useNavigate();

  useEffect(() => {
    if (!user.displayName) {
      console.log("No user logged In");
      history("/");
    } else {
      console.log("Logged In");
    }
  }, []);

  return (
    <div>
      <Header />
      <h4>Welcome {user.displayName}</h4>
    </div>
  );
}
export default Home;
