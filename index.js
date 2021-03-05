//dotenv config
const express = require("express")
const app = express()
const {errorHandler, wrapErrors, logErrors} = require('./src/utils/middleware/errorHandlers')
const helmet = require('helmet')
const boom = require('@hapi/boom')
const authRoutes = require('./src/routes/auth')
const ingredientsRoutes = require('./src/routes/ingredients')
const recipesRoutes = require('./src/routes/recipes')
const cors = require('cors')
const usersRoutes = require('./src/routes/users')

//helmet
app.use(helmet())
//cors
app.use(cors())

app.use(express.json())
//errors
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

app.set('etag', false);

app.use(express.static('public', {
  cacheControl: false,
  etag: false,
  lastModified: false,
}));


authRoutes(app)
ingredientsRoutes(app)
recipesRoutes(app)
usersRoutes(app)

app.use('*',(req, res, next) => {
  res.status(404)
  res.json(boom.notFound('missing'))
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server running in: http://localhost:${PORT}`)
})