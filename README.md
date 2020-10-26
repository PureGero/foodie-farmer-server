# Foodie Farmer API Server

The Node.js api server code for the Foodie Farmer app

## Running the api server

Firstly install the required packages with

  `npm install`

Then run the server with

  `npm run start`

### MySQL Server

The api relies on a mysql server to operate,  
install a mysql server then set up a database and a user to match the fields in `models/database.js`

## API

The api endpoints provided by this server are documented as follows

### POST /signin

Sign into the server with the specified google account

`idtoken` The google idtoken to be used to authenticate with

### GET /signout

Sign out of any logged in accounts

### GET /customer/get_profile

Get the customer's profile details

### GET /customer/get_produce

Get the list of produces

`id` The id of the produce to get (optional)  
`limit` The limit of results to return (optional)  

### GET /customer/get_group_items

Get the list of group purchase items

`id` The id of the group purchase to get (optional)  
`limit` The limit of results to return (optional)  

### GET /customer/list_recommend

Get the customer's recommended items

`count` The number of recommended items to return (default is 3)  

### GET /customer/list_stock_types

List the stock types

### GET /customer/list_farms

List the farms

### POST /customer/edit_address

Edit the customer's address

`address` New address value

### POST /customer/edit_bankaccount

Edit the customer's bank account

`bsb` New bsb value  
`accountNumber` New account number value  
`accountName` New acount name value  

### GET /farmer/get_farm_stock

Get the list of the farmer's stock

### GET /farmer/get_farm_group_purchases

Get the list of the farmer's group purchases

### GET /farmer/edit_farm

Edit the farmer's farm details

`farmName` The name of the farm  
`farmAddress` The address of the farm  

### GET /farmer/add_stock

Add a product to the farmer's store

`id` Id of the product to edit (optional, if missing a new product will be
     created)  
`name` Name of the product  
`description` Description of the product  
`picture` A url to a picture of the product  
`quantity` The amount of stock available  
`expirationDate` When the product will expire  
`price` The price of the product  
`type` Type of the product  

### GET /farmer/add_group_purchase

Add a product to the farmer's store

`id` Id of the group purchase to edit (optional, if missing a new group
     purchase will be created)  
`stockId` The id of the stock to use for the group purchase  
`endTime` When the grou purchase will close  
`capacity` The maximum number of products that can be bought as part of this
           group purchase  
`maxDiscount` The discount value if all stock in this group purchase is
              bought  
