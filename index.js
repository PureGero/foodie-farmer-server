const cookieParser = require('cookie-parser')
const express = require('express')
const expressFormData = require('express-form-data')

const PORT = 3000

const app = express()

// Third party parsers
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(expressFormData.parse())

// foodie-farmer routers
const login = require('./login/login')
const customer = require('./customer/customer')
const farmer = require('./farmer/farmer')

// foodie-farmer models
const init = require('./models/init')

app.use(login)
app.use('/customer', customer)
app.use('/farmer', farmer)

app.listen(PORT, () => {
  console.log(`foodie-farmer-server listening on http://localhost:${PORT}`)
})