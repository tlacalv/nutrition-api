const express = require('express')
const debug = require("debug")("app:api");
const { userIdSchema } =require('../utils/schemas/users')
const validationHandler = require('../utils/middleware/validationHandler')
const boom = require('@hapi/boom')
const passport = require('passport')
const errorBoom = require('../utils/functions/errorBoom')
const UsersService = require('../services/users')
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler')

require('../utils/auth/strategies/jwt')

const usersService = new UsersService()


const usersRoutes = (app) => {
  const router = express.Router()
  app.use('/api/users', router)

  router.get('/',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:users']),
    async (req,res) => {
      try {
        const usersRaw = await usersService.getUsers()
        let users = usersRaw.map((user) => {
          delete user.password
          delete user.key
          return user
        })
        res.status(200).json({
          data: users,
          message: "Users retrived"
        })

      } catch (error) {
        debug(error)
        errorBoom(error,res)
      }
    }
  )
  router.get('/:userId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['read:users']),
    validationHandler(userIdSchema, 'params'),
    async (req,res) => {
      const { userId } = req.params
      try {
        const user = await usersService.getUserById({userId})
        if(user) {
          delete user.password
          delete user.key
          res.status(200).json({
            data: user,
            message: "User retrived"
          })
        } else {
          errorBoom(boom.notFound(),res)
        }

      } catch (error) {
        debug(error)
        errorBoom(error, res)
      }
    }
  )
  
  router.delete('/:userId',
    passport.authenticate('jwt', {session: false}),
    scopesValidationHandler(['delete:users']),
    validationHandler(userIdSchema, 'params'),
    async (req,res) => {
      const { userId } = req.params
      try {
        const deletedUser = await usersService.deleteUser({userId});
        res.status(200).json({
          message: "User deleted",
          id: deletedUser
        })
      } catch (error) {
        errorBoom(error)
      }
    }
  )
  
}

module.exports = usersRoutes;