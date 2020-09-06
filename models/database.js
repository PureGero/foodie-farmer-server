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
  picture: {
    type: DataTypes.STRING,
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

const BankAccounts = sequelize.define('BankAccounts', {
  accountNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  BSB: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false
  } 
})

Customers.hasMany(BankAccounts, {
  foreignKey: {
    name: 'uid',
    allowNull: false
  }
})

Customers.sync({ alter: true });
BankAccounts.sync({ alter: true})

db.Customers = Customers;
db.BankAccounts = BankAccounts;

module.exports = db;