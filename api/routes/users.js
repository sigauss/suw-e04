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
  console.log(req.body)
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
    "path": `/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=` + req.params.id,
    "headers": {
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

router.post('/update-session-active-repo', function (req, res) {
  req.session.activeRepo = req.body
  res.json(null);
})

router.post('/update-session-active-category', function (req, res) {
  req.session.activeCategory = req.body.activeCategory
  res.json(null);
})

router.post('/update-session-logged', function(req, res){
  req.session.logged = 'logged'
  console.log(req.session)
  res.json(null)
})

router.post('/update-session-user-infos', function(req, res){
  req.session.userInfos = req.body.userInfos
  console.log(req.session)
  res.json(null)
})

router.post('/update-session-access-token', function(req, res){
  req.session.access_token = req.body.access_token
  console.log(req.session)
  res.json(null)
})

module.exports = router
