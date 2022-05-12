const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
// 載入 restaurant 的資料
const restaurantList = require("../../restaurant.json").results
const db = require('../../config/mongoose')

// 建構測試使用者
const SEED_USERS = [
  {
    name: 'user123',
    email: 'user1@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(0, 3)
  },
  {
    name: 'user456',
    email: 'user2@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(3, 6)
  }
]


db.once('open', () => {
  Promise.all(Array.from(SEED_USERS, seedUser => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        seedUser.restaurants.forEach(restaurant => {
          restaurant.userId = userId
        })
        return Restaurant.create(seedUser.restaurants)
      })
  }))
    .then(() => {
      console.log("Done!")
      process.exit()
    })
    .catch(error => console.log(error))
})