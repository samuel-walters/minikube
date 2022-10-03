const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://mongo-0.mongo:27017/my-db");
const nameSchema = new mongoose.Schema({
  userID: {
    type: Number,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model("User", nameSchema);

const server = express();

// Tidies up the request object.
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json());

server.use(express.static(__dirname + '/public'));
server.set("view engine", "ejs");

//post
server.post("/addname", (req, res) => {
  const insertedData = new User(req.body);
  const checkNumber = /^\d+$/;
  const checkString = /^[A-Za-z]+$/;
  const age = insertedData.age;
  if (checkString.test(insertedData.firstName) && checkString.test(insertedData.secondName)) {
    if (age != null && age >= 18 && age <= 100 && checkNumber.test(age)) {
      if (checkNumber.test(insertedData.userID)) {
        insertedData.save(function (err) {
          if (err) {
            res.render("error.ejs");
          }
          res.render("successful.ejs");
      });
      } else {
        res.render("invalid_id.ejs");
      }
    } else {
      res.render("invalid_age.ejs");
    }
  } else {
    res.render("invalid_name.ejs");
  }
});

// Get
server.get("/users", async(req, res) => {
  const readData = await User.find({});
  res.render("list.ejs", {userList: readData})
});

// Delete
server.get("/delete", (req, res) => {
  res.render("delete.ejs");
  var stringed = JSON.stringify(req.query, null, 2);
  var objectValue = JSON.parse(stringed);
  var passedID = objectValue['id'];
  if (passedID === undefined) {
    console.log("passedID is undefined.");
  } else {
    console.log(passedID);
    User.remove({"userID":passedID}, function(err,result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
}});

server.listen(3000, () => {
  console.log(`Server listening on port 3000!`)
});