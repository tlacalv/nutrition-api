const express = require('express')
const { createUserSchema } =require('../utils/schemas/users')
const validationHandler = require('../utils/middleware/validationHandler')
const { config } = require('../config')
const boom = require('@hapi/boom')
const UsersService = require('../services/users')
const passport = require('passport')
const { errorBoom} = require('../utils/functions')
const { compareSync } = require('bcrypt')

require('../utils/auth/strategies/basic')

const usersService = new UsersService()

const authRoutes = (app) => {
  const router = express.Router()
  app.use('/api/auth', router)

  router.post(
    '/login',
    async (req, res,next) => {

      //passport
      passport.authenticate('basic', (error, user) => {
        try{
          if(error || !user){
            errorBoom(error,res)
            next(error)
            return
          }
          req.login(user, {session: false}, async (err) => {
  
          })
        } catch(err) {
          next(err)
        }
        
        console.log('user ', user)

      })(req,res,next)
      // res.json({ message: "success"})
    }
  )
  router.post(
    '/sign-up',
    validationHandler(createUserSchema),
    async (req, res, next) => {
      const body = req.body
      let {email} = body
      const {admin} = req.query
      let role;

      if (admin && admin === config.adminKey) {
        role = config.adminKey
      }else {
        role = config.regularKey
      }
      let user = {...body, role}

      try {
        //check for registered user
        let registeredUser = await usersService.getUser({email})
        if(registeredUser){
          res.status(409)
          res.json({
            error: 409,
            message: "A user with that email already exists"
          })
          return

        }
        const createdUserId = await usersService.createUser({user})
        res.status(201).json({ 
          data: createdUserId,
          message: "user registered"
        })
      } catch (error) {
        next(error)
      }
      
      
    }
  )
  
  router.post(
    '/token',
    (req, res) => {
      const body = req.body;
      console.log(body)
      res.json({ message: "success"})
      
    }
  )
}

module.exports = authRoutes;