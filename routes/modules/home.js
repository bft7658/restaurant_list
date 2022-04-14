const express = require('express')
const router = express.Router()

// 載入 Restaurant model
const Restaurant = require('../../models/restaurant')
// 瀏覽全部餐廳
router.get('/', (req, res) => {
  // 從資料庫找出資料
  Restaurant.find()
    // 撈資料以後想用 res.render()，要先用 .lean() 來處理
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 搜尋餐廳
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find({
    $or: [
      { name: { $regex: keyword, $options: "$i" } },
      { category: { $regex: keyword, $options: "$i" } },
    ]
  })
    .lean()
    .then((restaurants) => {
      res.render('index', { restaurants, keyword });
    })
    // Restaurant.find()
    //   .lean()
    //   .then(restaurants => {
    //     const filterRestaurants = restaurants.filter(data =>
    //       data.name.toLowerCase().includes(keyword) ||
    //       data.name_en.toLowerCase().includes(keyword) ||
    //       data.category.toLowerCase().includes(keyword)
    //     )
    //     res.render('index', { restaurants: filterRestaurants, keyword })
    //   })
    .catch(error => console.log(error))
})

router.get('/:sort', (req, res) => {
  const selectedSort = req.params.sort
  const sortObj = {
    '0': { name_en: 'asc' },
    '1': { name_en: 'desc' },
    '2': { rating: 'desc' },
    '3': { rating: 'asc' }
  }
  Restaurant.find()
    .lean()
    .sort(sortObj[selectedSort])
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// 匯出路由模組
module.exports = router