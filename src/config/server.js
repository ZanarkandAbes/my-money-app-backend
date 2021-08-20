const port = 3003

const express = require('express')
const bodyParser = require('body-parser')

// Rotas:

const billingCycles = require('./routes')
const app = express()
const allowCors = require('./cors')
const queryParser = require('express-query-int')

// Body Parser:

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(allowCors)
app.use(queryParser())

app.use('/billingCycles', billingCycles)

// Servidor:

app.listen(port, () => {
  console.log(`BACK-END is running on port ${port}.`)
})

module.exports = app