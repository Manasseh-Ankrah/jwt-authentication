const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./routes/user");
const app = express();
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/user", User);

// Port variable
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// app.get("/", (req, res) => {
//   console.log(process.env.JWT_SECRET);
//   res.send("Hello World");
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
