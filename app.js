// require packages used in the project
const express = require("express")
const app = express()
const PORT = 3000
const hbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const hbshelpers = require('handlebars-helpers')
const multihelpers = hbshelpers()
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

// setting template engine
app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

// start and listen on the Express server
app.listen(PORT, () => {
  console.log(`Express is running on localhost:${PORT}`)
})