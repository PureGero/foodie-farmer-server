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
  deliverToCollectionPoint: {
    type: DataTypes.BOOLEAN,
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
    allowNull: false,
    autoIncrement: true
  },
  BSB: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accountNumber: {
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
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Maybe find an API to detect addresses and check they are real
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

const StockType = sequelize.define('StockType', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING
  }
})

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  expirationDate: {
    type: DataTypes.DATE
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
  },
  picture: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.DOUBLE
  },
  isSelling: {
    type: DataTypes.BOOLEAN
  },
  detailed_description: {
    type: DataTypes.STRING
  },
  rating: {
    type: DataTypes.DOUBLE
  },
  comment: {
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
    allowNull: false,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER
  }
})

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  }
})

const Driver = sequelize.define('Driver', {
  licenseNumber: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
})

const GroupPurchase = sequelize.define('GroupPurchase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  endTime: {
    type: DataTypes.DATE
  },
  capacity: {
    type: DataTypes.INTEGER
  },
  maxDiscount: {
    type: DataTypes.DOUBLE
  }
})

const GroupPurchaseOrder = sequelize.define('GroupPurchaseOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER
  }
})

// Database Associations
Customers.belongsTo(Farm)
Customers.belongsTo(BankAccounts)
Stock.belongsTo(StockType)
Stock.belongsTo(Farm)
Order.belongsTo(Stock)
Order.belongsTo(Customers)
Farm.hasOne(Route, {as: 'Start'})
Customers.hasMany(Route)
Driver.hasMany(Route)
GroupPurchase.belongsTo(Stock)
GroupPurchase.hasMany(GroupPurchaseOrder)
GroupPurchaseOrder.belongsTo(Customers)
GroupPurchaseOrder.belongsTo(GroupPurchase)

sequelize.sync({ alter: true })

db.Customers = Customers
db.BankAccounts = BankAccounts
db.Farm = Farm
db.StockType = StockType
db.Stock = Stock
db.Order = Order
db.GroupPurchase = GroupPurchase
db.GroupPurchaseOrder = GroupPurchaseOrder

module.exports = db
