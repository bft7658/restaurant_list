// 使用 require 載入 Express
const express = require('express')
const app = express()
const port = 3000

// 在 Express 中使用樣版引擎
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定靜態檔案
app.use(express.static('public'))

// 讀取 JSON 檔案
const restaurantList = require('./restaurant.json')

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.id)
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(item =>
    item.name.toLowerCase().includes(keyword.toLowerCase().trim()) ||
    item.category.toLowerCase().includes(keyword.toLowerCase().trim()) ||
    item.name_en.toLowerCase().includes(keyword.toLowerCase().trim())
  )
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})