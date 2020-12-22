const boom = require('@hapi/boom');
const errorBoom = require('../functions/errorBoom')
const IngredientsService = require('../../services/ingredients')

//pasamos el array con scopes
const permissionValidation = () => {
  const ingredientsService = new IngredientsService()
  //usamos middleware
  return async (req, res, next) => {
    const {presentScopes} = req
    const { ingredientId } = req.params


    if(presentScopes.includes('write:ingredients')) {
      const ingredient = await ingredientsService.getIngredient({ingredientId})
      console.log(ingredient)
      req.user._id===ingredient.userId? console.log('si'): console.log('no')
    }
    if(presentScopes.includes('writeAll:ingredients')) {
      //admin
    }

  }
}

module.exports = permissionValidation;