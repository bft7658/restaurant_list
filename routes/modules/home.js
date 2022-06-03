const express = require('express')
const router = express.Router()
// 載入 Restaurant model
const Restaurant = require('../../models/restaurant')

// 搜尋餐廳
router.get('/search', (req, res) => {
  const userId = req.user._id
  const { keyword, sort } = req.query
  let method = {}
  switch (sort) {
    case '1':
      method = { name_en: 'asc' }
      break
    case '2':
      method = { name_en: 'desc' }
      break
    case '3':
      method = { rating: 'desc' }
      break
    case '4':
      method = { rating: 'asc' }
      break
  }
  Restaurant.find({ userId })
    .lean()
    .sort(method)
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
      res.render('index', { restaurants, keyword, sort })
    })
    .catch(error => console.log(error))
})
// 瀏覽全部餐廳
router.get('/', (req, res) => {
  const userId = req.user._id
  // 從資料庫找出資料
  Restaurant.find({ userId })
    // 撈資料以後想用 res.render()，要先用 .lean() 來處理
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router