// require packages used in the project
const express = require("express")
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting mongodb connect
mongoose.connect('mongodb://localhost/restaurnat-list')
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
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id)

  res.render('show', { restaurant: restaurant })
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