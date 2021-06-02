const express = require('express')
const route = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurant')

route.use('/', home)
route.use('/restaurants', restaurants)

module.exports = route