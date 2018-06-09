const { Router } = require("express");

const router = Router();
const http = require("https")
const repos = {};

/* GET user organizations listing. */
router.get('/github/organizations/:token', function(req, res, next) {
  let body;
  var options = {
    "method": "GET",
    "hostname": "api.github.com",
    "port": null,
    "path": `/user/organizations?access_token=${req.params.token}`,
    "headers": {
      "user-agent": "Awesome-Octocat-App",
      "accept": "application/json",
      "cache-control": "no-cache",
    }
  };
  var request = http.request(options, function (response) {
    var chunks = [];
    var body;
    response.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    response.on("end", function () {
      body = Buffer.concat(chunks);
      console.log('le body', body.toString())
      res.json(body.toString());
      // res.sendStatus(200);
    });
  }, body);
  request.end();  
});

/* GET repos by slug. 
router.get("/repo/:slug", function(req, res, next) {
  const name = req.params.name;
  if (name) {
    res.json(repos[name]);
  } else {
    res.sendStatus(404);
  }
}); */

module.exports = router;
