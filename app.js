// 使用 require 載入 Express
const express = require('express')
// 引用 body-parser
const bodyParser = require('body-parser')
// 載入 session
const session = require('express-session')
// 載入 method-override
const methodOverride = require('method-override')
// 引用路由器
const routes = require('./routes')
// 載入 passport 設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const port = 3000

// 在 Express 中使用樣版引擎
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定靜態檔案
app.use(express.static('public'))
// 設定 express-session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))
// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
// 將 request 導入路由器
app.use(routes)


app.listen(port, () => {
  console.log(`This website is running on http://localhost:${port}`)
})