// 使用 require 載入 Express
const express = require('express')
// 載入 mongoose
const mongoose = require('mongoose')
// 載入 Restaurant model
const Restaurant = require('./models/restaurant')
// 引用 body-parser
const bodyParser = require('body-parser')
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
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 路由設計
// 瀏覽全部餐廳
app.get('/', (req, res) => {
  // 從資料庫找出資料
  Restaurant.find()
    // 撈資料以後想用 res.render()，要先用 .lean() 來處理
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 瀏覽新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// 新增餐廳的資料
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽特定餐廳資料
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 瀏覽編輯餐廳頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 編輯餐廳的資料
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  // 土法煉鋼法
  // return Restaurant.findById(id)
  //   .then((restaurant) => {
  //     (restaurant.name = req.body.name),
  //       (restaurant.name_en = req.body.name_en),
  //       (restaurant.category = req.body.category),
  //       (restaurant.image = req.body.image),
  //       (restaurant.location = req.body.location),
  //       (restaurant.phone = req.body.phone),
  //       (restaurant.google_map = req.body.google_map),
  //       (restaurant.rating = req.body.rating),
  //       (restaurant.description = req.body.description);
  //     return restaurant.save();
  //   })
  // 教案寫法
  Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((error) => console.log(error));
})

// 刪除特定餐廳資料
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
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