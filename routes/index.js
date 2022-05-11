const express = require('express')
const router = express.Router()

// 引入 home 模組程式碼
const home = require('./modules/home')
// 引入 restaurants 模組程式碼
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
// 掛載 middleware
const { authenticator } = require('../middleware/auth')  

// 將網址結構符合的字串導向對應的模組 
router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
router.use('/' || '/search', authenticator, home)

module.exports = router