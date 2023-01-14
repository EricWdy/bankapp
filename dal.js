const e = require("express");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27018"; // 容器内的port是27017，如果改用本地链接，可按compose中实际定义的host端口来连接
let db = null;

// intialize a mongo server instance
const client = new MongoClient(uri);
const dbName = "myproject";

async function main() {
  try {
    // connect and verify connection
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");

    // switch to the db
    db = client.db(dbName);
  } catch (error) {
    console.error("Connection failed. Error: ", error);
  }
}

main().catch(console.error);



// create user account
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0, role: "client" };
    collection.insertOne(doc, { w: 1 }, function (err, result) {
      err ? reject(err) : resolve(doc);
    });
  });
}

// all users
function all(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .findOne({email:email}) //findOne可以用then，find不可以
      .then(doc=>{
        console.log('doc retrieved according to email: ', JSON.stringify(doc))
        if (doc.role === "Admin") {
            console.log('Database: Hello Admin!')
            db.collection("users")
                .find({})
                .toArray(function (err, docs) {
                    err ? reject(err) : resolve(docs);
                  });
        } else {
            // not admin. Get their own data only
            console.log('Database: this is not admin!')
            db.collection("users")
                .find({email:email})
                .toArray(function (err, docs) {
                    err ? reject(err) : resolve(docs);
                  });
        }
      }).catch(error=>reject(error))
      
  });
}

// login, transactions, and read all data
function retrieveAcc(email) {
  return new Promise((resolve, reject) => {
    const emldoc = db
      .collection("users")
      .findOne({ email: email })
      .then((doc) => {
        if (doc) {
          resolve(doc);
        } else {
          reject(0); // return 0 if email not found
        }
      })
      .catch((error) => reject(error));
  });
}

// update balance: applicable for both deposit and withdraw
function updateBalance(email, val) {
  return new Promise((resolve, reject) => {
    const updateVal = db
      .collection("users")
      .updateOne({ email: email }, { $inc: { balance: val } })
      .then((updateResult) => {
        if (updateResult.acknowledged){
            // send back val
            resolve(true);
        } else {
            reject(false)
        }
      })
      .catch((error) => reject(error));
  });
}

module.exports = { create, all, retrieveAcc, updateBalance };
