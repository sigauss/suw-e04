const { Router } = require("express");

const router = Router();

const repos = {};

/* GET repos listing. */
router.get("/repos", function(req, res, next) {
  res.json(repos);
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
