const express = require('express')
const router = express.Router()

// 載入 Restaurant model
const Restaurant = require('../../models/restaurant')

// 瀏覽新增餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增餐廳的資料
router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽特定餐廳資料
router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 瀏覽編輯餐廳頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 編輯餐廳的資料
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

module.exports = router