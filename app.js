// 使用 require 載入 Express
const express = require('express')
// 載入 mongoose
const mongoose = require('mongoose')
// 載入 Restaurant model
const Restaurant = require('./models/restaurant')
const app = express()
const port = 3000
// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('Error connecting')
})
// 連線成功
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// 在 Express 中使用樣版引擎
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定靜態檔案
app.use(express.static('public'))


// 路由設計
// 瀏覽全部餐廳
app.get('/', (req, res) => {
  // 從資料庫找出資料
  Restaurant.find()
    // 撈資料以後想用 res.render()，要先用 .lean() 來處理
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
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
  console.log(`This website is running on http://localhost:${port}`)
})