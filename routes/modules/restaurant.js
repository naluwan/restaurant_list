const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/search', (req, res) => {
  let keyword = req.query.keyword
  let errorMsg = ''

  Restaurant.find({
    "$or": [
      { name: { $regex: `${keyword}`, $options: '$i' } },
      { category: { $regex: `${keyword}`, $options: '$i' } }
    ]
  })
    .lean()
    .then(restaurants => {
      if (restaurants.length === 0) errorMsg = '找不到您要的餐廳，請重新輸入!'
      res.render('index', { restaurants, keyword, errorMsg })
    })
    .catch(error => console.log(error))
})

router.get('/sort', (req, res) => {
  const sortMethod = req.query.sortMethod
  Restaurant.find()
    .lean()
    .sort(sortMethod)
    .then(restaurants => res.render('index', { restaurants, sortMethod }))
    .catch(error => console.log(error))
})

router.get('/create', (req, res) => {
  return res.render('create')
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant, category: restaurant.category }))
    .catch(error => console.log(error))
})

router.post('/', (req, res) => {
  const newRestaurant = req.body

  Restaurant.create({
    name: newRestaurant.name,
    category: newRestaurant.category,
    image: newRestaurant.image,
    location: newRestaurant.location,
    phone: newRestaurant.phone,
    google_map: newRestaurant.google_map,
    rating: newRestaurant.rating,
    description: newRestaurant.description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const newRestaurant = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = newRestaurant.name
      restaurant.category = newRestaurant.category
      restaurant.image = newRestaurant.image
      restaurant.location = newRestaurant.location
      restaurant.phone = newRestaurant.phone
      restaurant.google_map = newRestaurant.google_map
      restaurant.rating = newRestaurant.rating
      restaurant.description = newRestaurant.description
      return restaurant.save()
    }).then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id

  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router