//dotenv config
const express = require("express")
const app = express()
const { createUserSchema } =require('../utils/schemas/users')
const validationHandler = require('../utils/middleware/validationHandler')
const {errorHandler, wrapErrors, logErrors} = require('../utils/middleware/errorHandlers')
const jwt = require("jsonwebtoken")
const boom = require('@hapi/boom')


app.use(express.json())
//errors
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

//router 
const router = express.Router()
app.use('/api/auth', router)

router.post(
  '/login',
  (req, res) => {
    const body = req.body;
    console.log(body)
    res.json({ message: "success"})
  }
)
router.post(
  '/sign-up',
  validationHandler(createUserSchema),
  (req, res) => {
    const body = req.body;
    const {admin} = req.query;
    console.log(admin)
    console.log(body)
    res.json({ message: "user registered"})
    
  }
)

router.post(
  '/login',
  (req, res) => {
    const body = req.body;
    console.log(body)
    res.json({ message: "success"})
    
  }
)

app.use('*',(req, res, next) => {
  res.json(boom.notFound('missing'))
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running in: http://localhost:${PORT}`)
})