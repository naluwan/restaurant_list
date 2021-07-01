const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurant')
const user = require('./modules/users')


router.use('/restaurants', restaurants)
router.use('/users', user)
router.use('/', home)

module.exports = router