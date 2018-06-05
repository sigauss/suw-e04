const express = require("express");

// Create express instnace
const app = express();

const repos = require("./routes/repos");

// Import API Routes
app.use(repos);

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app,
  debug: true
};
