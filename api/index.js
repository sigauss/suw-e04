const express = require("express");
const session = require('express-session')
// const mongoose = require('mongoose');
 
// //connect to MongoDB
// mongoose.connect('mongodb://ds147450.mlab.com:47450/suw-accio', {user: 'arnaud', pass: 'suwe04'});
// const db = mongoose.connection;

// app.use(session({
//   store: new MongoStore({ mongooseConnection: mongoose.connection })
// }));

// //handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('connected')
// });

// Create express instance 
const app = express();
const organizations = require("./routes/organizations");
const repos = require("./routes/repos");
const component = require("./routes/component");
const auth = require("./routes/users");

// const baseUrl = process.env.NODE_ENV || 'http://localhost:3000'

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
