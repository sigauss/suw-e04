const { Router } = require("express");

const router = Router();
const http = require("https")
const repos = {};

/* GET user organizations listing. */
router.get('/github/:owner/:repo/:category/:path/component/:token', function(req, res, next) {
  let body;
  let path = req.params.path;
  console.log(req.params.path)
  if(req.params.path.includes('+')) {
    path = req.params.path.replace('+', '/');
  }
  var options = {
    "method": "GET",
    "hostname": "api.github.com",
    "port": null,
    "path": `/repos/${req.params.owner}/${req.params.repo}/contents/${req.params.category}/${path}?access_token=${req.params.token}`,
    "headers": {
      "user-agent": "Awesome-Octocat-App",
      "accept": "application/json",
      "cache-control": "no-cache",
    }
  };
  console.log(options.path)
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
