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
  req.body.userId = req.user._id
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽特定餐廳資料
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 瀏覽編輯餐廳頁面
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 編輯餐廳的資料
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOneAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((error) => console.log(error));
})

// 刪除特定餐廳資料
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOneAndRemove({ _id, userId })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

module.exports = router