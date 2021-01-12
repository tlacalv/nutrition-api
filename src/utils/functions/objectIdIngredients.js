const { ObjectId } = require('mongodb');
const objectIdIngredients = (ingredientsArray) => {
  return ingredientsArray.map((ingredient) => {
    let {quantity, ingredientId} = ingredient
    return {
      quantity,
      ingredientId: ObjectId(ingredientId)
    }
  })
  
}

module.exports = objectIdIngredients;
