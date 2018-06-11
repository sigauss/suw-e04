const axios = require('axios')
const http = require("https")
const { Router } = require('express')
const User = require("../models/User")
const router = Router()


/* GET users listing. */
router.get('/users', function (req, res, next) {
  console.log('hey');
  User.find(function(err, users){
    if (err){
        res.send(err); 
    }
    console.log(users);
  });
})

router.post('/login', function (req, res, next) {
  User.findOne({username: req.body.user.username, access_token: req.body.user.access_token}, function(err, user){
    if(err) {
      console.log(err);
    }
    if(user) {
      res.json(user)
    }
    else {
      res.json(null)
    }
  })
})

router.get('/logout', function (req, res) {
  req.session.authUser = null
  res.json('')
})

router.post('/users', function (req, res, next) {
  var userData = {
    username: req.body.username,
    access_token: req.body.access_token,
    avatar: req.body.avatar,
    github_id: req.body.github_id,
    email: req.body.email
  }

  User.findOne({username: userData.username}, function(err, user){
    if(err) {
      console.log(err);
    }
    if(user) {
      // user.access_token = req.session.access_token
      // req.session.authUser = {username: user.username, access_token: user.access_token, id: user._id}
    }
    else {
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        }
      // req.session.authUser = {username: user.username, access_token: user.access_token, id: user._id}
      })
    }
    res.json(user)
  })
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  // const id = parseInt(req.params.id)
  // if (id >= 0 && id < users.length) {
  //   res.json(users[id])
  // } else {
  //   res.sendStatus(404)
  // }
  console.log('hey');
  User.find(function(err, users){
    if (err){
        res.send(err); 
    }
    res.json(users); 
  });
})

router.get('/auth/:id', function (req, res, next) {
  let body;
  var options = {
    "method": "POST",
    "hostname": "github.com",
    "port": null,
    "path": "/login/oauth/access_token?client_id=6512280b0626a7722d81&client_secret=71182dca741cb055c14ef5b3705a1f14627e294c&code=" + req.params.id,
    "headers": {
      "accept": "application/json",
      "cache-control": "no-cache",
      "postman-token": "5fc07892-11ff-ea7a-8ab1-d7ef33dabb10"
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
      console.log('auth', body.toString());
      req.session.authUser = {access_token: JSON.parse(body).access_token }
      req.session.save()
      res.json(body.toString());
    });
  }, body);
  request.end();
})

router.get('/github/user/:token', function (req, res, next) {
  let body;
  var options = {
    "method": "GET",
    "hostname": "api.github.com",
    "port": null,
    "path": `/user?access_token=${req.params.token}`,
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
      res.json(body.toString());
    });
  }, body);
  request.end();
})

router.get('/github/email/:token', function (req, res, next) {

  var options = {
    "method": "GET",
    "hostname": "api.github.com",
    "port": null,
    "path": `/user/emails?access_token=${req.params.token}`,
    "headers": {
      "user-agent": "Awesome-Octocat-App",
      "accept": "application/json",
      "cache-control": "no-cache",
    }
  };
  
  var req = http.request(options, function (response) {
    var chunks = [];
  
    response.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    response.on("end", function () {
      let body = JSON.parse(Buffer.concat(chunks));
      let primary_email = body.filter(email => email.primary == true)
      res.send(primary_email[0].email);
    });
  });

  req.end();
})

module.exports = router
