const cookieParser = require('cookie-parser')
const express = require('express')
const expressFormData = require('express-form-data')

var Sequelize = require('sequelize')
  , sequelize = new Sequelize('FoodieFarmer', 'hejjnt', 'hejjnt', {
      dialect: "mysql",
      host:     "localhost",
      port:     3306,
    });

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  }, function (err) { 
    console.log('Unable to connect to the database:', err);
  });

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

app.use(login)
app.use('/customer', customer)
app.use('/farmer', farmer)

app.listen(PORT, () => {
  console.log(`foodie-farmer-server listening on http://localhost:${PORT}`)
})