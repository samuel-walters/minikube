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

// post
app.post("/addname", async (req, res) => {
  const insertedData = req.body;
  const checkNumber = /^\d+$/;
  const checkString = /^[A-Za-z]+$/;
  const age = insertedData.age;
  if (checkString.test(insertedData.firstName) && checkString.test(insertedData.lastName)) {
    if (age != null && age >= 18 && age <= 100 && checkNumber.test(age)) {
        if (checkNumber.test(insertedData.userID)) {
            const doc = {
                UserID: insertedData.userID,
                firstName: insertedData.firstName,
                lastName: insertedData.lastName,
                age: insertedData.age
            }
            let errorOccurred = 0;
            await main(doc, "post").then(console.log).catch(error => errorOccurred = 1).finally(() => client.close());
            if (errorOccurred == 0) {
              res.render("successful.ejs");
            } else {
              res.render("error.ejs");
            }
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
app.get("/users", async (req, res) => {
  const readData = await main({}, "get");
  res.render("list.ejs", {userList: readData})
});

// Delete
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