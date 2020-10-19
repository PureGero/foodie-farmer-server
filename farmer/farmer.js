const express = require('express')
const db = require('../models/database')

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
      stockType: stock.StockTypeName,
    })
  })
  res.send(result)
})

// Edit the farmer's farm details
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
router.post('/add_stock', (req, res) => {
  let name = req.body.name
  let description = req.body.description
  let picture = req.body.picture
  let quantity = req.body.quantity || 1
  let expirationDate = req.body.expirationDate
  let price = req.body.price
  let isSelling = req.body.isSelling || 1
  let stockType = req.body.stockType

  if (!name || !description || !picture || !quantity || !expirationDate || !price) return res.status(400).send('Missing paramteres')

  quantity = parseInt(quantity)
  price = partseInt(price)

  if (quantity <= 0 || isNaN(quantity)) return res.status(400).send('Quantity must be a positive integer')
  if (price <= 0 || isNaN(price)) return res.status(400).send('Price must be a positive real')

  expirationDate = new Date(expirationDate)

  if (isNaN(expirationDate.getTime())) return res.status(400).send('Invalid expiration date')

  let customer = await db.Customers.findOne({
    where: {
      userName: req.email
    }
  })

  const stock = await db.Stock.create({
    expirationDate: expirationDate,
    quantity: quantity,
    name: name,
    picture: picture,
    description: description,
    price: price,
    isSelling: isSelling,
    StockTypeName: stockType,
    FarmId: customer.FarmId
  })

  res.send('Stock successfully added')
})

module.exports = router
