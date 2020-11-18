const express = require('express')
const { createUserSchema } =require('../utils/schemas/users')
const validationHandler = require('../utils/middleware/validationHandler')

const authRoutes = (app) => {
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
}

module.exports = authRoutes;