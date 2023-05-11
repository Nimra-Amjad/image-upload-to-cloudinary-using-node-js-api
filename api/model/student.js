const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  email: { type: String, unique: true },
  phone: Number,
  gender: String,
  image: String
});

module.exports = mongoose.model("Student", studentSchema);
