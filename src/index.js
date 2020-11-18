//dotenv config
const express = require("express")
const app = express()
const { createUserSchema } =require('./utils/schemas/users')
const validationHandler = require('./utils/middleware/validationHandler')
const {errorHandler, wrapErrors, logErrors} = require('./utils/middleware/errorHandlers')
const jwt = require("jsonwebtoken")
const boom = require('@hapi/boom')
const authRoutes = require('./routes/auth')


app.use(express.json())
//errors
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)


authRoutes(app)

app.use('*',(req, res, next) => {
  res.json(boom.notFound('missing'))
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running in: http://localhost:${PORT}`)
})