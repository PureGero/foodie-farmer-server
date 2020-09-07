var { Sequelize, DataTypes, DATEONLY } = require('sequelize')
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
})

// Model for BankAccounts
const BankAccounts = sequelize.define('BankAccounts', {
  number: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  BSB: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  } 
})

const Farm = sequelize.define('Farm', {
  id: {
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

const StockType = sequelize.define('StockType', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  minPrice: {
    type: DataTypes.INTEGER,
  },
  maxPrice: {
    type: DataTypes.INTEGER,
  },
  count: {
    type: DataTypes.INTEGER
  }
})

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  expirationDate: {
    type: DataTypes.DATE
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true,
  tableName: "Stock"
})

const Order = sequelize.define('Order',  {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
})

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
})

// Database Associations
Producers.belongsTo(Farm)
Producers.belongsTo(BankAccounts)
Customers.belongsTo(BankAccounts)
Stock.belongsTo(StockType)
Stock.belongsTo(Farm)
Order.belongsTo(Customers)
Order.hasMany(OrderItem)
OrderItem.belongsTo(Stock)

sequelize.sync({ alter: true })

db.Customers = Customers
db.BankAccounts = BankAccounts
db.farm = Farm
db.Producers = Producers
db.StockType = StockType
db.Stock = Stock
db.Order = Order
db.OrderItem = OrderItem

module.exports = db
