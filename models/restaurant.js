const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 把我們想要的資料結構當成參數傳給 new Schema()
const restaurantSchema = new Schema({
  id: {
    type: Number,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  google_map: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {  // 加入關聯設定
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})
// 透過 module.exports 把這個 schema 輸出。匯出的時候我們把這份 schema 命名為 Restaurant，以後在其他的檔案直接使用 Restaurant 就可以操作和「餐廳」有關的資料了！
module.exports = mongoose.model('Restaurant', restaurantSchema)