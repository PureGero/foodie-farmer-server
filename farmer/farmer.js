const express = require('express')
const db = require('../models/database')
const Sequelize = require('sequelize')

const router = express.Router()

// Ensure farmers are signed in
router.use((req, res, next) => {
  if (!req.email) return res.status(400).send('You are not logged in')

  next()
})

// Get the list of the farmer's stock
router.get('/get_farm_stock', async (req, res) => {
  let customer = await db.Customers.findOne({
    where: {
      userName: req.email
    }
  })

  // Get the produce from the database
  let stocks = await db.Stock.findAll({
    where: {
      FarmId: customer.FarmId
    }
  })

  let result = []
  stocks.forEach(stock => {
    result.push({
      id: stock.id,
      name: stock.name,
      description: stock.description,
      picture: stock.picture,
      price: stock.price,
      quantity: stock.quantity,
      expirationDate: stock.expirationDate,
      stockType: stock.StockTypeName
    })
  })
  res.send(result)
})

// Get the list of the farmer's group purchases
router.get('/get_farm_group_purchases', async (req, res) => {
  let customer = await db.Customers.findOne({
    where: {
      userName: req.email
    }
  })

  // Get the produce from the database
  let groupPurchases = await db.GroupPurchase.findAll({
    include: [{
      model: db.Stock, 
      where: {
        FarmId: customer.FarmId
      }
    }, {
      model: db.GroupPurchaseOrder
    }],
    where: {
      endTime: {
        [Sequelize.Op.gte]: new Date()
      }
    }
  })

  let result = []
  groupPurchases.forEach(groupPurchase => {
    groupPurchase.totalQuantity = 0
    groupPurchase.GroupPurchaseOrders.forEach(order => 
      groupPurchase.totalQuantity += order.quantity)

    result.push({
      id: groupPurchase.id,
      stockId: groupPurchase.Stock.id,
      name: groupPurchase.Stock.name,
      picture: groupPurchase.Stock.picture,
      endTime: groupPurchase.endTime,
      capacity: groupPurchase.capacity,
      maxDiscount: groupPurchase.maxDiscount,
      totalQuantity: groupPurchase.totalQuantity
    })
  })
  res.send(result)
})

// Edit the farmer's farm details
// `farmName` The name of the farm  
// `farmAddress` The address of the farm  
router.post('/edit_farm', async (req, res) => {
  let farmName = req.body.farmName
  let farmAddress = req.body.farmAddress

  if (!farmName || !farmAddress) return res.status(400).send('Missing parameters')

  let customer = await db.Customers.findOne({
    where: {
      userName: req.email
    },
    include: [db.Farm]
  })

  let farm = customer.Farm

  if (!farm) {
    // Create the bank account in database
    farm = await db.Farm.create({ name: farmName, address: farmAddress })

    await db.Customers.update({ FarmId: farm.id }, {
      where: {
        userName: req.email
      }
    })
  } else {
    // Edit bank account in database
    await db.Farm.update({ name: farmName, address: farmAddress }, {
      where: {
        id: farm.id
      }
    })
  }

  res.send('Farm details successfully changed')
})

// Add a product to the farmer's store
// `id` Id of the product to edit (optional, if missing a new product will be
//   created)  
// `name` Name of the product  
// `description` Description of the product  
// `picture` A url to a picture of the product  
// `quantity` The amount of stock available  
// `expirationDate` When the product will expire  
// `price` The price of the product  
// `type` Type of the product  
router.post('/add_stock', async (req, res) => {
  let id = req.body.id
  let name = req.body.name
  let description = req.body.description
  let picture = req.body.picture
  let quantity = req.body.quantity || 1
  let expirationDate = req.body.expirationDate
  let price = req.body.price
  let isSelling = req.body.isSelling || 1
  let stockType = req.body.stockType

  if (!name || !description || !picture || !expirationDate || !price) return res.status(400).send('Missing paramteres')

  quantity = parseInt(quantity)
  price = parseFloat(price)

  if (quantity <= 0 || isNaN(quantity)) return res.status(400).send('Quantity must be a positive integer')
  if (price <= 0 || isNaN(price)) return res.status(400).send('Price must be a positive real')

  expirationDate = new Date(expirationDate)

  if (isNaN(expirationDate.getTime())) return res.status(400).send('Invalid expiration date')

  let customer = await db.Customers.findOne({
    where: {
      userName: req.email
    }
  })

  let stock
  let stockDetails = {
    expirationDate: expirationDate,
    quantity: quantity,
    name: name,
    picture: picture,
    description: description,
    price: price,
    isSelling: isSelling,
    StockTypeName: stockType,
    FarmId: customer.FarmId
  }

  if (id) {
    // Id specified, update the stock
    await db.Stock.update(stockDetails, {
      where: {
        id: id
      }
    })

    stock = await db.Stock.findOne({
      where: {
        id: id
      }
    })
  } else {
    // No id specified, create it
    stock = await db.Stock.create(stockDetails)
  }

  res.send({
    id: stock.id,
    name: stock.name,
    description: stock.description,
    picture: stock.picture,
    price: stock.price,
    quantity: stock.quantity,
    stockType: stock.StockTypeName,
  })
})

// Add a group purchase to the farmer's store
// `id` Id of the group purchase to edit (optional, if missing a new group
//   purchase will be created)  
// `stockId` The id of the stock to use for the group purchase  
// `endTime` When the grou purchase will close  
// `capacity` The maximum number of products that can be bought as part of this
//         group purchase  
// `maxDiscount` The discount value if all stock in this group purchase is
//            bought  
router.post('/add_group_purchase', async (req, res) => {
  let id = req.body.id
  let stockId = req.body.stockId
  let endTime = req.body.endTime
  let capacity = req.body.capacity
  let maxDiscount = req.body.maxDiscount

  if (!stockId || !endTime || !capacity || !maxDiscount) return res.status(400).send('Missing paramteres')

  capacity = parseInt(capacity)
  maxDiscount = parseFloat(maxDiscount)

  if (capacity <= 0 || isNaN(capacity)) return res.status(400).send('Capacity must be a positive integer')
  if (maxDiscount <= 0 || isNaN(maxDiscount)) return res.status(400).send('Max discount must be a positive real')

  endTime = new Date(endTime)

  if (isNaN(endTime.getTime()) || endTime.getTime() < Date.now() + 60000) return res.status(400).send('Invalid end time')

  let groupPurchase
  let groupPurchaseDetails = {
    endTime: endTime,
    capacity: capacity,
    maxDiscount: maxDiscount,
    StockId: stockId
  }

  if (id) {
    // Id specified, update the group purchase
    await db.GroupPurchase.update(groupPurchaseDetails, {
      where: {
        id: id
      }
    })
  } else {
    // No id specified, create it
    groupPurchase = await db.GroupPurchase.create(groupPurchaseDetails)
    id = groupPurchase.id
  }

  groupPurchase = await db.GroupPurchase.findOne({
    include: [{
      model: db.Stock
    }, {
      model: db.GroupPurchaseOrder
    }],
    where: {
      id: id
    }
  })

  groupPurchase.totalQuantity = 0
  groupPurchase.GroupPurchaseOrders.forEach(order => 
    groupPurchase.totalQuantity += order.quantity)


  res.send({
    id: groupPurchase.id,
    stockId: groupPurchase.Stock.id,
    name: groupPurchase.Stock.name,
    picture: groupPurchase.Stock.picture,
    endTime: groupPurchase.endTime,
    capacity: groupPurchase.capacity,
    maxDiscount: groupPurchase.maxDiscount,
    totalQuantity: groupPurchase.totalQuantity
  })
})

module.exports = router
