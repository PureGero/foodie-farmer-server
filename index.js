const cookieParser = require('cookie-parser')
const express = require('express')
const expressFormData = require('express-form-data')

const PORT = 3000

const app = express()

// Third party parsers
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(expressFormData.parse());

// foodie-farmer routers
const login = require('./login/login')

app.use(login);

app.listen(PORT, () => {
  console.log(`foodie-farmer-server listening on http://localhost:${PORT}`)
})