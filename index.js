const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')

const PORT = 3000

const app = express()

// Third party parsers
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// foodie-farmer models
const db = require('./models/database')

// foodie-farmer routers
const login = require('./login/login')
const customer = require('./customer/customer')
const farmer = require('./farmer/farmer')


app.use(login)
app.use('/customer', customer)
app.use('/farmer', farmer)

app.listen(PORT, () => {
  console.log(`foodie-farmer-server listening on http://localhost:${PORT}`)
})