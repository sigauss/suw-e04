const axios = require('axios')
const { Router } = require('express')

const router = Router()

// Mock Users
const users = [
  { name: 'Alexandre' },
  { name: 'Pooya' },
  { name: 'Sébastien' }
]

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.json(users)
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  console.log('grigri')
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})

router.get('/fetch_auth_token', function (req, res, next) {
  console.log('ouloulou')
  axios.post('https://github.com/login/oauth/access_token', {
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/x-www-form-urlencoded',
    },
    params: {
    client_id: '6512280b0626a7722d81',
    client_secret: '71182dca741cb055c14ef5b3705a1f14627e294c',
    code: req.params.id,
    }
  },
  )
  .then(function (response) {
    console.log('hariba');
  })
  .catch(function (error) {
    console.log(error);
  });
  res.sendStatus(200);
})

module.exports = router
