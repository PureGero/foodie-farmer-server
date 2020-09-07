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
  }
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

const Farm = sequelize.define('Farm', {
  farmID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Maybe find an API to detect addresses and check they are real
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const Producers = sequelize.define('Producers', {
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
  }
})

Producers.belongsTo(Farm)
Producers.belongsTo(BankAccounts)
Customers.belongsTo(BankAccounts)

Customers.sync({ alter: true })
BankAccounts.sync({ alter: true})
Farm.sync({ alter: true})
Producers.sync({ alter: true})


db.Customers = Customers
db.BankAccounts = BankAccounts
db.farm = Farm
db.Producers = Producers

module.exports = db