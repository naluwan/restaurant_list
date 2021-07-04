const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')
const home = require('./modules/home')
const restaurants = require('./modules/restaurant')
const user = require('./modules/users')
const auth = require('./modules/auth')


router.use('/restaurants', authenticator, restaurants)
router.use('/auth', auth)
router.use('/users', user)
router.use('/', authenticator, home)

module.exports = router