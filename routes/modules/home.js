const express = require('express')
const router = express.Router()

// 載入 Restaurant model
const Restaurant = require('../../models/restaurant')
// 瀏覽全部餐廳
router.get('/', (req, res) => {
  const sort = req.query.sort || 'name'
  // 從資料庫找出資料
  Restaurant.find()
    // 撈資料以後想用 res.render()，要先用 .lean() 來處理
    .lean()
    // .sort({ _id: 'asc' })
    .sort(sort)
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 搜尋餐廳
router.get('/search', (req, res) => {
  // 用 query string 方式
  const sort = req.query.sort || 'name'
  const keyword = req.query.keyword
  Restaurant.find({
    $or: [
      { name: { $regex: keyword, $options: "$i" } },
      { category: { $regex: keyword, $options: "$i" } },
    ]
  })
    .lean()
    .sort(sort)
    .then((restaurants) => {
      res.render('index', { restaurants, keyword });
    })
    .catch(error => console.log(error))

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
  //     .catch(error => console.log(error))
})

// 用 params 方式
// router.get('/:sort', (req, res) => {
//   const sort = req.params.sort
//   const sortObj = {
//     '0': { name_en: 'asc' },
//     '1': { name_en: 'desc' },
//     '2': { rating: 'desc' },
//     '3': { rating: 'asc' }
//   }
//   Restaurant.find()
//     .lean()
//     .sort(sortObj[sort])
//     .then(restaurants => res.render('index', { restaurants }))
//     .catch(error => console.error(error))
// })

// 匯出路由模組
module.exports = router