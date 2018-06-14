
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const MongoStore = require('connect-mongo')(session);

let port = process.env.PORT || 3000
let host = process.env.HOST || '127.0.0.1'

const mongoose = require('mongoose');
 
//connect to MongoDB
mongoose.connect('mongodb://ds147450.mlab.com:47450/suw-accio', {user: 'arnaud', pass: 'suwe04'});
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected')
});

app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(bodyParser.json())

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}
start()
