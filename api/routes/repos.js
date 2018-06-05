const { Router } = require("express");

const router = Router();

const repos = {};

/* GET repos listing. */
router.get("/repos", function(req, res, next) {
  res.json(repos);
});

/* GET repos by ID. */
router.get("/repos/:id", function(req, res, next) {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < repos.length) {
    res.json(repos[id]);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
