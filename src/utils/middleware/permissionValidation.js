const boom = require('@hapi/boom');
const errorBoom = require('../functions/errorBoom')
const IngredientsService = require('../../services/ingredients')

//pasamos el array con scopes
const ingredientsService = new IngredientsService()
const putIngredient = () => {
  //usamos middleware
  return async (req, res, next) => {
    const {presentScopes} = req
    const { ingredientId } = req.params

    if(presentScopes.includes('write:ingredients')) {
      const ingredient = await ingredientsService.getIngredient({ingredientId})
      let userId = req.user._id.toString()
      let ingredientUserId = ingredient.userId.toString()
      if(userId===ingredientUserId){ 
        next()
      }else{
        errorBoom(boom.forbidden("Resource doesn't belong to user"),res)
        next(boom.forbidden())
      }
    }
    if(presentScopes.includes('writeAll:ingredients')) {
      //admin
    }

  }
}

module.exports = {putIngredient};