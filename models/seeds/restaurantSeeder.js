const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
// 載入 restaurant 的資料
const restaurantList = require("../../restaurant.json").results

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('Error connecting')
})

db.once('open', () => {
  console.log('Connected to MongoDB')
  Restaurant.create(restaurantList)
    .then(() => {
      console.log("done!")
    })
    .catch(error => console.log(error))
})