var { Sequelize, DataTypes } = require('sequelize')
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

db = {}
db.Sequelize = Sequelize

// Model for customer
const Customers = sequelize.define('Customers', {
  // Model attributes are defined here
  userName: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
  },
  deliveryRoute: {
    type: DataTypes.STRING,
  },
  bankAccount: {
    type: DataTypes.INTEGER,
  }
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(Customers === sequelize.models.Customers); // true
Customers.sync({ force: true });
console.log("The table for the Customers model was just (re)created!");
db.Customers = Customers;

module.exports = db;