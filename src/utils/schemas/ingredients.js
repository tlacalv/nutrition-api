const joi = require('@hapi/joi');

//estructura regex de mongo
const ingredientIdSchema = joi.object({ movieId: joi.string().regex(/^[0-9a-fA-F]{24}$/) } );
const ingredientName = joi.string();
const ingredientCalories = joi.number().max(1000);
const ingredientFat = joi.number();
const ingredientCarb = joi.number();
const ingredientProtein = joi.number();
const ingredientUserId = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const ingredientSchema = joi.object({
  name:            ingredientName.required(),
  calories:        ingredientCalories.required(),
  fat:             ingredientFat.required(),
  carbohydrate:    ingredientCarb.required(),
  protein:         ingredientProtein.required(),
  userId:          ingredientUserId.required(),
});


module.exports = {
  ingredientIdSchema,
  ingredientSchema
}