const express = require('express')
const db = require('../models/database')
const Sequelize = require('sequelize')

const router = express.Router()

// Get the customer's profile details
router.get('/get_profile', async (req, res) => {
  // Ensure customer is signed in
  if (!req.email) return res.status(400).send('You are not logged in')

  // Get the Customer from the database
  let customers = await db.Customers.findAll({
    where: {
      userName: req.email
    },
    include: [db.BankAccounts, db.Farm]
  })

  if (!customers.length) return res.status(400).send('Could not find profile')

  let customer = customers[0]

  if (!customer.BankAccount) customer.BankAccount = {}
  if (!customer.Farm) customer.Farm = {}

  res.send({
    userName: customer.userName,
    name: customer.name,
    picture: customer.picture,
    address: customer.address,
    deliverToCollectionPoint: customer.deliverToCollectionPoint,
    bsb: customer.BankAccount.BSB,
    accountNumber: customer.BankAccount.accountNumber,
    accountName: customer.BankAccount.name,
    farmName: customer.Farm.name,
    farmAddress: customer.Farm.address
  })
})

// Get the list of produces
// `id` The id of the produce to get (optional)  
// `limit` The limit of results to return (optional)  
router.get('/get_produce', async (req, res) => {
  // Get the produce from the database
  let items = await db.Stock.findAll({
    include: [db.Farm],
    where: {
      isSelling: true,
      id: {
        [Sequelize.Op.like]: req.query.id || '%'
      }
    },
    limit: parseInt(req.query.limit) || 1000,
    order: Sequelize.literal('rand()')
  })

  let result = []
  items.forEach(item => {
    result.push({
      id: item.id,
      name: item.name,
      picture: item.picture,
      description: item.description,
      price: item.price,
      detail: item.detailed_description,
      rating: item.rating,
      comment: item.comment,
      farm: item.Farm.name,
      location: item.Farm.address
    })
  })
  res.send(result)

})

// Get the list of group purchase items
// `id` The id of the group purchase to get (optional)  
// `limit` The limit of results to return (optional)  
router.get('/get_group_items', async (req, res) => {
  // Get the items from the database
  let groupPurchases = await db.GroupPurchase.findAll({
    include: [{
      model: db.Stock, 
      include: [db.Farm]
    }, {
      model: db.GroupPurchaseOrder
    }],
    where: {
      id: {
        [Sequelize.Op.like]: req.query.id || '%'
      }
    },
    limit: parseInt(req.query.limit) || 1000,
    order: Sequelize.literal('rand()')
  })

  let results = []

  groupPurchases.forEach(groupPurchase => {
    groupPurchase.totalQuantity = 0
    groupPurchase.GroupPurchaseOrders.forEach(order => 
      groupPurchase.totalQuantity += order.quantity)

    results.push({
      id: groupPurchase.id,
      capacity: groupPurchase.capacity,
      remaining: groupPurchase.capacity - groupPurchase.totalQuantity,
      endTime: groupPurchase.endTime,
      maxDiscount: groupPurchase.maxDiscount,
      name: groupPurchase.Stock.name,
      picture: groupPurchase.Stock.picture,
      description: groupPurchase.Stock.description,
      price: groupPurchase.Stock.price,
      detail: groupPurchase.Stock.detailed_description,
      rating: groupPurchase.Stock.rating,
      comment: groupPurchase.Stock.comment,
      farm: groupPurchase.Stock.Farm.name,
      location: groupPurchase.Stock.Farm.address,
    })
  })

  res.send(results)

})

// Get the customer's recommended items
// `count` The number of recommended items to return (default is 3)  
router.get('/list_recommend', async (req, res) => {
  let count = req.query.count || 3

  // Get up to count number of random items from the database
  let stocks = await db.Stock.findAll({
    where: {
      isSelling: true
    },
    limit: parseInt(count),
    order: Sequelize.literal('rand()'),
    include: [db.Farm]
  })

  let result = []
  stocks.forEach(stock => {
    result.push({
      id: stock.id,
      name: stock.name,
      description: stock.description,
      image: stock.picture,
      price: stock.price,
      farm: stock.Farm.name,
      location: stock.Farm.address
    })
  })
  res.send(result)
})

// List the stock types
router.get('/list_stock_types', async (req, res) => {
  // Get the stock types from the database
  let stockTypes = await db.StockType.findAll()

  let result = []
  stockTypes.forEach(stockType => {
    result.push({
      name: stockType.name,
      picture: stockType.picture
    })
  })
  res.send(result)
})

// List the farms
router.get('/list_farms', async (req, res) => {
  // Get the stock types from the database
  let farms = await db.Farm.findAll()

  let result = []
  farms.forEach(farm => {
    result.push({
      name: farm.name,
      address: farm.address,
      image: farm.image, 
      description: farm.description
    })
  })
  res.send(result)
})

// Place an order on either quick purchase or group purchase items
// The body of the request should be a json array of objects with the keys:  
// `id` The id of the quick purchase or group purchase item
// `count` The number of items to order
// `groupPurchase` True if this item is a group purchase
router.post('/place_order', async (req, res) => {
  // Ensure customer is signed in
  if (!req.email) return res.status(400).send('You are not logged in')

  // For each item ordered
  req.body.forEach(item => {
    if (item.groupPurchase) {
      // Place an order for a group purchase
      db.GroupPurchaseOrder.create({
        GroupPurchaseId: item.id,
        quantity: item.count,
        CustomerUserName: req.email
      })
    } else {
      // Place an order for a quick purchase
      db.Order.create({
        StockId: item.id,
        quantity: item.count,
        CustomerUserName: req.email
      })
    }
  })

  res.send('Success')
})

// List the customer's orders
router.get('/list_orders', async (req, res) => {
  // Ensure customer is signed in
  if (!req.email) return res.status(400).send('You are not logged in')

  let orders = await db.Order.findAll({
    where: {
      CustomerUserName: req.email
    },
    include: [db.Stock]
  })

  let groupPurchaseOrders = await db.GroupPurchaseOrder.findAll({
    where: {
      CustomerUserName: req.email
    },
    include: [{
      model: db.GroupPurchase,
      include: [db.Stock]
    }]
  })

  let results = []

  orders.forEach(order => {
    results.push({
      name: order.Stock.name,
      price: order.Stock.price,
      picture: order.Stock.picture,
      quantity: order.quantity,
      date: order.createdAt,
      status: 'Pending'
    })
  })

  groupPurchaseOrders.forEach(groupPurchaseOrder => {
    results.push({
      name: groupPurchaseOrder.GroupPurchase.Stock.name,
      price: groupPurchaseOrder.GroupPurchase.Stock.price,
      picture: groupPurchaseOrder.GroupPurchase.Stock.picture,
      quantity: groupPurchaseOrder.quantity,
      date: groupPurchaseOrder.createdAt,
      status: 'Awaiting Group Purchase'
    })
  })

  res.send(results)
})

// Edit the customer's address
// `address` New address value
router.post('/edit_address', async (req, res) => {
  // Ensure customer is signed in
  if (!req.email) return res.status(400).send('You are not logged in')

  let address = req.body.address
  let deliverToCollectionPoint = req.body.deliverToCollectionPoint

  if (!address) return res.status(400).send('Missing address')

  // Edit bank account in database
  await db.Customers.update({ address: address, deliverToCollectionPoint: deliverToCollectionPoint }, {
    where: {
      userName: req.email
    }
  })

  res.send('Address successfully changed')
})

// Edit the customer's bank account
// `bsb` New bsb value  
// `accountNumber` New account number value  
// `accountName` New acount name value  
router.post('/edit_bankaccount', async (req, res) => {
  // Ensure customer is signed in
  if (!req.email) return res.status(400).send('You are not logged in')

  let bsb = req.body.bsb
  let accountNumber = req.body.accountNumber
  let accountName = req.body.accountName

  if (!bsb || !accountNumber || !accountName) return res.status(400).send('Missing parameters')

  bsb = parseInt(bsb)
  accountNumber = parseInt(accountNumber)

  if (isNaN(bsb) || isNaN(accountNumber)) return res.status(400).send('Parameters must be numbers')

  let customer = await db.Customers.findOne({
    where: {
      userName: req.email
    },
    include: [db.BankAccounts]
  })

  let bankAccount = customer.BankAccount

  if (!bankAccount) {
    // Create the bank account in database
    bankAccount = await db.BankAccounts.create({ BSB: bsb, accountNumber: accountNumber, name: accountName })

    await db.Customers.update({ BankAccountNumber: bankAccount.number }, {
      where: {
        userName: req.email
      }
    })
  } else {
    // Edit bank account in database
    await db.BankAccounts.update({ BSB: bsb, accountNumber: accountNumber, name: accountName }, {
      where: {
        number: bankAccount.number
      }
    })
  }

  res.send('Bank account successfully changed')
})

module.exports = router