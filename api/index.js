const express = require("express");
const session = require('express-session')
const mongoose = require('mongoose');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
 
localStorage.setItem('myFirstKey', 'myFirstValue');
console.log(localStorage.getItem('myFirstKey'));

// const MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://ds147450.mlab.com:47450/suw-accio', {user: 'arnaud', pass: 'suwe04'});
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected')
});

// Create express instnace
const app = express();
const organizations = require("./routes/organizations");
const repos = require("./routes/repos");
const component = require("./routes/component");
const auth = require("./routes/users");

// Import API Routes
app.use(organizations);
app.use(repos);
app.use(component);
app.use(auth);

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app,
  debug: true
};
