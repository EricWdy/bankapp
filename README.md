# Project: Bankapp
## Why this project was created
This project was developped as a capstone for the MIT full-stack developer programme to demonstrate capability of full-stack (MERN) development.
## How to install and run
- You can pull this repo by running the "git pull" command
- Install the dependencies by running "npm install"
- The web app requires a MongoDB instance. If you don't have MongoDB on your local machine, you can instantiate one using Docker by running the command "docker run -p 27018:207017 --name <give the container a name> -d mongo". After that, connect to it through localhost:27018
- If you run this project on your local machine, simply run "npm start" on the root of the project dir.
## Technology stack
- MongoDB: database
- Express: server framework providing routing in the middle tier
- React: front-end libraries to build single-paged applications
- Node.js: Javascript runtime on the server end
- Bootstrap: CSS libraries for front-end styling
## Functions
The app is a simulation of a real bank application. Users can sign up/in and do deposit/withdraw transactions, with balance updated on both front-end and backend. Other functions include browse (all) users' account info, according to the roles they have.
## License
MIT license
