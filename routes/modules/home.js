const express = require('express')
const route = express.Router()
const Restaurant = require('../../models/restaurant')

route.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

module.exports = route