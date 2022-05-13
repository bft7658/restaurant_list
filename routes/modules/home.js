const express = require('express')
const router = express.Router()

// 載入 Restaurant model
const Restaurant = require('../../models/restaurant')
// 瀏覽全部餐廳
router.get('/', (req, res) => {
  const userId = req.user._id
  const sort = req.query.sort || 'name'
  // 從資料庫找出資料
  Restaurant.find({ userId })
    // 撈資料以後想用 res.render()，要先用 .lean() 來處理
    .lean()
    // .sort({ _id: 'asc' })
    .sort(sort)
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 搜尋餐廳
router.get('/search', (req, res) => {
  const userId = req.user._id
  // 用 query string 方式
  const sort = req.query.sort || 'name'
  const keyword = req.query.keyword
  Restaurant.find({ userId })
    .lean()
    .sort(sort)
    .then(restaurants => {
      if (keyword) {
        restaurants = restaurants.filter(data =>
          data.name.toLowerCase().includes(keyword) ||
          data.name_en.toLowerCase().includes(keyword) ||
          data.category.toLowerCase().includes(keyword)
        )
      }
      if (restaurants.length === 0) {
        return res.render('error')
      }
      res.render('index', { restaurants, keyword })
    })
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router