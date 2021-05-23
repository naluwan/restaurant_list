const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')

mongoose.connect('mongodb://localhost/restaurnat-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb coeencted')

  restaurantList.results.forEach(item => {
    Restaurant.create({
      id: `${item.id}`,
      name: `${item.name}`,
      name_en: `${item.name_en}`,
      category: `${item.category}`,
      image: `${item.image}`,
      location: `${item.location}`,
      phone: `${item.phone}`,
      google_map: `${item.google_map}`,
      rating: `${item.rating}`,
      description: `${item.description}`
    })
  })

  console.log('seeder done!')
})