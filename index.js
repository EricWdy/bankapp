var express = require("express");
var app = express();
var cors = require("cors");
var dal = require("./dal.js");
var admin = require("./admin.js");
const swaggerJsDoc = require("swagger-jsdoc");
const sawggerUI = require("swagger-ui-express");
const { response } = require("express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Banking App API",
      version: "1.0.0",
      description: "Banking App CRUD API",
    },
    host: "localhost:3001",
    basePath: "/",
    schemes: ["http"],
    tags: [
      {
        name: "Account-related operations",
        description: "APIs for account creation, login, and account info reading"
      },
      {
        name: "Balance-related operations",
        description: "APIs for reading and updating balance"
      }
    ],
    components: {
      securitySchemes: {
        GoogleAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  apis: ["index.js"], // files containing annotations as above
};

const openapiSpecification = swaggerJsDoc(options);
app.use("/api-docs", sawggerUI.serve, sawggerUI.setup(openapiSpecification));

// serve static files from public
app.use(express.static("public"));
app.use(cors());

// create user account
/**
 * @swagger
 * /account/create/{name}/{email}/{password}:
 *   get:
 *    summary: Create an account
 *    description: Create an account with name, email, and password.
 *    tags: ["Account-related operations"]
 *    parameters:
 *      - name: name
 *        description: user name
 *        in: path
 *        required: true
 *        type: string
 *      - name: email
 *        description: user email
 *        in: path
 *        required: true
 *        type: string
 *      - name: password
 *        description: user password
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: Account creation success
 */
app.get("/account/create/:name/:email/:password", function (req, res) {
  dal
    .create(req.params.name, req.params.email, req.params.password)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((error) => console.log(error));
});

// login user
/**
 * @swagger
 * /account/login/{email}/{password}:
 *    get:
 *      tags: ["Account-related operations"]
 *      summary: Log in
 *      description: User log in with email and password
 *      parameters:
 *        - name: email
 *          in: path
 *          required: true
 *          type: string
 *          description: user email
 *        - name: password
 *          in: path
 *          required: true
 *          type: string
 *          description: user password
 *      responses:
 *        200:
 *          description: login success
 */
app.get("/account/login/:email/:password", function (req, res) {
  const email = req.params.email;
  const password = req.params.password;
  dal
    .retrieveAcc(email)
    .then((doc) => {
      // check if password match
      console.log(JSON.stringify(doc));

      if (doc.password === password) {
        console.log("authentication success!");
        res.send({ status: 1, msg: { name: doc.name, email: doc.email } });
      } else {
        console.log("authentication failure");
        res.send({ status: -1, msg: "Wrong password. Please try again." });
      }
    })
    .catch((reason) => {
      if (reason === 0) {
        res.send({ status: 0, msg: "Email not found" });
      } else {
        res.send({
          status: -0,
          msg: `Cannot verify your account info. Error code: ${reason.code}`,
        });
      }
    });
});

/**
 * @swagger
 * /account/all/:
 *    get:
 *      tags: ["Account-related operations"]
 *      summary: Read user(s) account info
 *      description: Read relevant user account data. For users with a "client" role, this is the user's own account info; for the "Admin" role, this is all the users' info
 *      security:
 *        - GoogleAuth: []
 *      responses:
 *        200:
 *          description: OK
 *
 */
// all accounts
app.get("/account/all/", function (req, res) {
  // read token from header
  const idToken = req.headers.authorization; // 千万不要写成大写A！
  console.log("idToken:", idToken);

  // verify token
  if (idToken) {
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(function (decodedToken) {
        console.log("decodedToken: ", decodedToken);
        // get email from decodedToken to query for role
        const email = decodedToken.email;

        // retrieve (all) data and send them back -- according to role
        dal.all(email).then((docs) => {
          console.log("docs:", JSON.stringify(docs));
          res.send({ status: "success", data: docs });
        });
      })
      .catch((error) => {
        console.error(error);
        // if error, send error msg
        res.send({ status: "failure", data: "", error: error });
      });
  } else {
    // no token, send empty data back
    res.send({
      status: "unauthorized",
      data: "",
      error: new Error("Unauthorized access. Please login first"),
    });
  }
});


/**
 * @swagger
 * /balance/:
 *    get:
 *      tags: ["Balance-related operations"]
 *      summary: Read balance from backend
 *      description: Read a certain user's balance, according to the decoded account info from the request header (Authorization). The header bearer needs an IdToken from the Google authentication service. To get such an id, the user has to be registered with the Google authentication service first. This means apart from registering with the Bank app database, the user will also sign up with Google auth service.
 *      security:
 *        - GoogleAuth: []
 *      responses:
 *        200: 
 *          description: Balance read success
 */     
app.get("/balance/", function (req, res) {
  // read Google token
  const idToken = req.headers.authorization;
  // console.log("idToken received: ", idToken);
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      // console.log("decodedToken: ", decodedToken);
      //get email from decoded token
      const email = decodedToken.email;
      dal
        .retrieveAcc(email)
        .then((doc) => {
          console.log("Read account balance success!");
          res.send({ status: true, value: doc.balance });
        })
        .catch((e) => res.send({ status: false, value: e }));
    })
    .catch((e) => {
      console.error(e);
      res.send({ status: false, value: e });
    });
});


/**
 * @swagger
 * /deposit/{depVal}:
 *    get:
 *      tags: ["Balance-related operations"]
 *      summary: Update an account's balance according to the deposited value
 *      description: Add the existing balance with the deposit value (depVal). IdToken protected transaction. User first need to sign in to get idToken from Google Authentication service. Account info also retrieved from the IdToken. 
 *      parameters:
 *        - name: depVal
 *          in: path
 *          required: true
 *          type: string
 *      security:
 *        - GoogleAuth: []
 *      responses:
 *        200:
 *          description: deposit success
 */
// deposit write
app.get("/deposit/:depVal", function (req, res) {
  const depVal = Number(req.params.depVal);
  console.log("value from url request:", depVal);

  // read Google token
  const idToken = req.headers.authorization;

  // get token to read user
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      const email = decodedToken.email;

      // update database
      dal
        .updateBalance(email, depVal)
        .then((success) => {
          if (success) {
            console.log("Success! database modified.");
            res.send({ status: true, value: depVal });
          } else {
            res.send({ status: false, value: null });
          }
        })
        .catch((e) => {
          res.send({ status: false, value: e });
        });
    });
});


/**
 * @swagger
 * /withdraw/{wdVal}:
 *    get:
 *      tags: ["Balance-related operations"]
 *      summary: Update an account's balance according to the value withrawn.
 *      description: Update an account's balance with the withdraw value (wdVal). IdToken protected transaction. User first need to sign in to get an IdToken from Google Authentication service. Account info also retrieved from the decoded token.
 *      parameters:
 *        - name: wdVal
 *          in: path
 *          required: true
 *          type: string     
 *      security:
 *        - GoogleAuth: []
 *      responses:
 *        200:
 *          description: withdraw success
 */     
// withdraw write
app.get("/withdraw/:wdVal", function (req, res) {
  const wdVal = Number(req.params.wdVal) * -1; // url中是正数，用updateBalance得改成负数
  console.log("input for database:", wdVal);

  // read Google token
  const idToken = req.headers.authorization;

  // get token to read user
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      const email = decodedToken.email;

      // update database
      dal
        .updateBalance(email, wdVal)
        .then((success) => {
          if (success) {
            console.log("Success! database modified.");
            res.send({ status: true, value: wdVal });
          }
        })
        .catch((e) => {
          res.send({ status: false, value: e });
        });
    });
});

const port = 3001;
app.listen(port);
console.log("Running on port: " + port);
