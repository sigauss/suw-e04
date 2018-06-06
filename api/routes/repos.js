const { Router } = require("express");

const router = Router();

const repos = {};

/* GET repos listing. */
router.get("/repos", function(req, res, next) {
  res.json(repos);
});

router.get("/repos/create", function(req, res, next) {
  res.json(repos);
});

/* GET repos by ID. */
router.get("/repos/:name", function(req, res, next) {
  const name = parseInt(req.params.name);
  if (name) {
    res.json(repos[name]);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
