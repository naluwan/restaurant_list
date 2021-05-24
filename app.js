// require packages used in the project
const express = require("express")
const app = express()
const port = 3000
const hbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const hbshelpers = require('handlebars-helpers')
const multihelpers = hbshelpers()

// setting template engine
app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting mongodb connect
mongoose.connect('mongodb://localhost/restaurnat-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected')
})

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

//routes setting
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurants/create', (req, res) => {
  return res.render('create')
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id

  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant, category: restaurant.category }))
    .catch(error => console.log(error))
})

app.post('/restaurants', (req, res) => {
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

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const newRestaurant = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = newRestaurant.name,
        restaurant.category = newRestaurant.category,
        restaurant.image = newRestaurant.image,
        restaurant.location = newRestaurant.location,
        restaurant.phone = newRestaurant.phone,
        restaurant.google_map = newRestaurant.google_map,
        restaurant.rating = newRestaurant.rating,
        restaurant.description = newRestaurant.description
      return restaurant.save()
    }).then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id

  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword

  // input不能為空白
  if (!keyword) {
    res.render('index', { restaurants: restaurantList.results, error: '餐廳名稱不可為空白，請重新輸入!' })
    return
  }

  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.trim().toLowerCase())
  })

  // 找不到餐廳
  if (restaurants.length === 0) {
    res.render('index', { restaurants: restaurantList.results, error: '找不到所輸入的餐廳，請重新輸入!' })
    return
  }

  res.render('index', { restaurants: restaurants, keyword: keyword })
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is running on localhost:${port}`)
})