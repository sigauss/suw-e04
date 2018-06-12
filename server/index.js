
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const baseUrl = process.env.BASE_URL

app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
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
  app.listen( process.env.PORT || 3000, process.env.HOST || '127.0.0.1')
  console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}
start()
