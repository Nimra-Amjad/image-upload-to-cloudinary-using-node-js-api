const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const Student = require("../model/student");
const checkAuth = require("../middleware/check-auth");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dz3yubgz1",
  api_key: "141726337433427",
  api_secret: "l0-Zq3UIP_n2wXBq1UT1Annjq2c",
});

router.get("/", checkAuth, (req, res, next) => {
  Student.find()
    .then((result) => {
      res.status(200).json({
        studentData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  Student.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        student: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Student.findByIdAndDelete({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        msg: "delete id",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  const file = req.files.image;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    console.log(result);
    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      image: result.url,
    });
    student
      .save()
      .then((result) => {
        console.log(result),
          res.status(200).json({
            newStudent: result,
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.put("/:id", (req, res, next) => {
  Student.findOneAndDelete(
    { _id: req.params.id },
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        image: req.body.image,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        update_product: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
