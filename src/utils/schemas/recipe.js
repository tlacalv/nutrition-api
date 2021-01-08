const joi = require('@hapi/joi');

//estructura regex de mongo
const recipeIdSchema = joi.object({ recipeId: joi.string().regex(/^[0-9a-fA-F]{24}$/) } );
const recipeName = joi.string();
const recipeIngredients = joi.array()
                             .items(joi.object({
                               quantity: joi.number(),
                               ingredientId: joi.string().regex(/^[0-9a-fA-F]{24}$/)
                             }));
const recipeWeight = joi.number();

const recipeSchema = joi.object({
  name:            recipeName.required(),
  ingredients:        recipeIngredients.required(),
  weight:             recipeWeight.required(),
});


module.exports = {
  recipeIdSchema,
  recipeSchema
}