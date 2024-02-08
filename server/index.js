const express = require("express");
require("dotenv").config();
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectToMongo = require("./db/connection");

// const controler = require("./db/authenticaton/controler");
// const hash = require("./db/authenticaton/controler");




const app = express();
const port = 
  process.env.NODE_ENV === "test"
    ? process.env.NODE_LOCAL_TEST_PORT
    : process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});
app.get("/", (req, res) => {
  res.send("Welcome to the e-commerce backend application!");
});

app.use("/customer", customerRoutes);
app.use("/admin" , adminRoutes);




module.exports = app;






