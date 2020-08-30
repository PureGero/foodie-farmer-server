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

var customerModel = require('./customerModel')