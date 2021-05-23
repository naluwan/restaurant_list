// require packages used in the project
const express = require("express")
const app = express()
const port = 3000
const hbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')

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

//routes setting
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
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