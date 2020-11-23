const express = require('express')
const { createUserSchema } =require('../utils/schemas/users')
const validationHandler = require('../utils/middleware/validationHandler')
const { config } = require('../config')
const boom = require('@hapi/boom')
const UsersService = require('../services/users')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { errorBoom} = require('../utils/functions')
const ApiKeyService = require('../services/apiKeys')

require('../utils/auth/strategies/basic')

const usersService = new UsersService()
const apiKeysService = new ApiKeyService()

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
            if(err){
              next(err)
            }
            //get user data
            const { _id: id, name, email, key } = user;
            //obtenemos scopes
            const apiKey = await apiKeysService.getApiKey({ token: key });
            if(!apiKey) {
              errorBoom(boom.unauthorized(),res)
              next(boom.unauthorized())
              return
            }
            
            //creamos payload con los datos de usuario y con scopes
            const payload = {
              sub: id,
              name,
              email,
              scopes: apiKey.scopes
            }
            //generamos JWT
            const token = jwt.sign(payload, config.jwtSecret, {
              expiresIn: '15m'
            });
            //regresamos status 200 y el JWT
            return res.status(200).json({
              token,
              user: { id, name, email }
            });
          })
        } catch(err) {
          next(err)
        }
        

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
      let key;

      if (admin && admin === config.adminKey) {
        key = config.adminKey
      }else {
        key = config.regularKey
      }
      let user = {...body, key}

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