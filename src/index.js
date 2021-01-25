//dotenv config
const express = require("express")
const app = express()
const {errorHandler, wrapErrors, logErrors} = require('./utils/middleware/errorHandlers')
const jwt = require("jsonwebtoken")
const boom = require('@hapi/boom')
const authRoutes = require('./routes/auth')
const ingredientsRoutes = require('./routes/ingredients')
const recipesRoutes = require('./routes/recipes')
const usersRoutes = require('./routes/users')



app.use(express.json())
//errors
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)


authRoutes(app)
ingredientsRoutes(app)
recipesRoutes(app)
usersRoutes(app)

app.use('*',(req, res, next) => {
  res.status(404)
  res.json(boom.notFound('missing'))
})

const PORT = 3000;

module.exports = app