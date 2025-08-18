const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoute");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// connect to DB
require("./db");

app.use("/api/auth", authRoutes);
app.use("/api/contact",contactRoutes );

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
