const express = require("express");
const app = express();
const studentRoute = require("./api/routes/student");
const facultyRoute = require("./api/routes/faculty");
const userRoute = require("./api/routes/user");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

mongoose.connect("mongodb+srv://nexus:nexus@cluster0.z59dylk.mongodb.net/test");
mongoose.connection.on("error", (err) => {
  console.log("connection failed");
});

mongoose.connection.on("connected", (connected) => {
  console.log("database connected");
});

app.use(fileUpload({
  useTempFiles:true 
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/student", studentRoute);
app.use("/faculty", facultyRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  res.status(400).json({
    error: "Bad Request",
  });
});

module.exports = app;
