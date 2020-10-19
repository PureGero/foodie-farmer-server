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

// Get a single item
router.get('/get_item', async (req, res) => {
  let id = req.query.id

  if (!id) return res.status(400).send('Missing item id')

  // Get the item from the database
  let items = await db.Stock.findAll({
    where: {
      id: id
    },
    include: [db.Farm]
  })

  if (!items.length) return res.status(400).send('Could not find item')

  let item = items[0]

  res.send({
    id: item.id,
    name: item.name,
    picture: item.picture,
    description: item.description,
    price: item.price,
    farm: item.Farm.name,
    location: item.Farm.address
  })

})

// Get the list of all produces
router.get('/get_produce', async (req, res) => {
  // Get the produce from the database
  let produces = await db.Stock.findAll({
    where: {
      isSelling: true
    },
    include: [db.Farm]
  })

  if (!produces.length) return res.status(400).send('Could not find profile')

  let result = []
  produces.forEach(produce => {
    result.push({
      id: produce.id,
      name: produce.name,
      picture: produce.picture,
      description: produce.description,
      price: produce.price,
      farm: produce.Farm.name,
      location: produce.Farm.address
    })
  })
  res.send(result)

})


// Get the items the customer could purchase matching a specified query
// `query` Query to search for
router.get('/search_items', async (req, res) => {
  // TODO Generate items from the database
  let query = req.body.query

  if (!query) return res.status(400).send('Missing query')

  // For testing purposes, sends an apple if an apple was searched for,
  // otherwise sends an orange
  if (~query.toLowerCase().indexOf('apple')) {
    res.send([
      {
        id: 652,
        name: "Apple",
        image: "https://i.imgur.com/YRwlA.jpg",
        price: 5.55,
        farm: "Doug's Apple Farm",
        location: "Thulimbah QLD"
      }
    ])
  } else {
    res.send([
      {
        id: 711,
        name: "Orange",
        image: "https://i0.wp.com/miakouppa.com/wp-content/uploads/2017/02/img_3938.jpg?resize=599%2C799&ssl=1",
        price: 7.00,
        farm: "Geoff's Orange Farm",
        location: "Mt Isa QLD"
      }
    ])
  }
})

// Get the customer's recommended items
router.get('/list_recommend', async (req, res) => {
  let count = req.query.count || 3

  // Get 3 random items from the database
  let stocks = await db.Stock.findAll({
    where: {
      isSelling: true
    },
    limit: parseInt(count),
    order: Sequelize.literal('rand()'),
    include: [db.Farm]
  })

  if (!stocks.length) return res.status(400).send('Could not find stocks')

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

// Get the group purchases that the customer can join in on
router.get('/list_group_purchases', async (req, res) => {
  // TODO Generate group purchases from the database

  res.send([
    {
      id: 398,
      name: "Apple",
      image: "https://i.imgur.com/YRwlA.jpg",
      price: 4.02,
      originalPrice: 5.55,
      customerCount: 61,
      farm: "Doug's Apple Farm",
      location: "Thulimbah QLD"
    }, {
      id: 398,
      name: "Apple",
      image: "https://i.imgur.com/YRwlA.jpg",
      price: 4.66,
      originalPrice: 5.55,
      customerCount: 45,
      farm: "Doug's Apple Farm",
      location: "Thulimbah QLD"
    }, {
      id: 398,
      name: "Apple",
      image: "https://i.imgur.com/YRwlA.jpg",
      price: 5.12,
      originalPrice: 5.55,
      customerCount: 32,
      farm: "Doug's Apple Farm",
      location: "Thulimbah QLD"
    }, {
      id: 425,
      name: "Orange",
      image: "https://i0.wp.com/miakouppa.com/wp-content/uploads/2017/02/img_3938.jpg?resize=599%2C799&ssl=1",
      price: 6.58,
      originalPrice: 7.00,
      customerCount: 29,
      farm: "Geoff's Orange Farm",
      location: "Mt Isa QLD"
    }
  ])
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
// `bankAccount` New bank account value
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