const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const client = new MongoClient("mongodb://mongo-0.mongo,mongo-1.mongo,mongo-2.mongo,mongo-3.mongo,mongo-4.mongo,mongo-5.mongo,mongo-6.mongo:27017");

async function main(doc, type, inputID) {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db("my-db");
  const collection = db.collection('users');
  if (type === "post") {
    await collection.createIndex({ "UserID": 1 }, { unique: true })
    await collection.insertOne(doc);
    console.log(`A document was inserted with the UserID: ${doc.UserID}`);
  } else if (type === "get") {
    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);
    return findResult;
  } else if (type === "delete") {
    const deleteResult = await collection.deleteOne({ UserID: inputID });
    console.log('Deleted a document => ', deleteResult);
  }
  return 'done.';
}

app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

app.post("/addname", async (req, res) => {
  const userID = req.body.UserID.trim();
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const age = req.body.age.trim();
  const checkNumber = /^\d+$/;
  const checkString = /^[A-Za-z]+$/;
  if (checkString.test(firstName) && checkString.test(lastName)) {
    if (checkNumber.test(age) && age != null) {
      if (age >= 18 && age <= 100) {
        if (checkNumber.test(userID)) {
          const doc = {
            UserID: userID,
            firstName: firstName,
            lastName: lastName,
            age: age
          }
          let errorOccurred = 0;
          await main(doc, "post").then(console.log).catch(error => errorOccurred = 1).finally(() => client.close());
          if (errorOccurred == 0) {
            res.send("Success!");
          } else {
            res.send("Failed to add user to the database. Perhaps check if the User ID is unique.");
          }
        } else {
          res.send("UserIDs must only contain digits.");
        }
      } else {
          res.send("The user must be older than 17 and younger than 101.");
      } 
    } else {
      res.send("Make sure you only use numbers for age.")
    }
  } else {
    res.send("Make sure you use only letters for names.");
  }
});

// Get
app.get("/successful", (req, res) => {
  res.render("successful.ejs")
});

app.get("/users", async (req, res) => {
  const readData = await main({}, "get");
  res.render("list.ejs", {userList: readData})
});

app.get("/delete", async (req, res) => {
  res.render("delete.ejs");
  var stringed = JSON.stringify(req.query, null, 2);
  var objectValue = JSON.parse(stringed);
  var passedID = objectValue['id'];
  if (passedID === undefined) {
    console.log("passedID is undefined.");
  } else {
    await main({}, "delete", passedID);
  }
});

app.listen(3000, () => console.log("Server started and listening on port 3000!"));