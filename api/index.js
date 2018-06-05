const express = require("express");

// Create express instnace
const app = express();

const repos = require("./routes/repos");
const auth = require("./routes/users");

// Import API Routes
app.use(repos);
app.use(auth);

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app,
  debug: true
};
