const MongoLib = require('../lib/mongo');

class RecipesService {
    constructor() {
        this.collection = 'recipes';
        this.mongoDB = new MongoLib();
    }
  // db.getCollection('ingredients').find({$text: { $search: "Tomato jalapeño"}},{score: { $meta: "textScore"}}).sort({score: {$meta: "textScore"}})
    async getIngredients () {
        const recipes = await this.mongoDB.getAll(this.collection, {})
        return recipes || []
    }
    async getUserIngredients ({userId}) {
        const query = userId && {userId}
        const recipes = await this.mongoDB.getAll(this.collection, query)
        return recipes || []
    }
    async searchIngredient ({text}) {
        const query = { $text: {$search: text}, score: { $meta: "textScore"}}
        const sort = {score: {$meta: "textScore"}}
        const recipes = await this.mongoDB.search(this.collection, query, sort)
        return recipes || []
    }
    async getIngredient ({ recipeId }) {
        
        const recipe = await this.mongoDB.get(this.collection, recipeId);
        return recipe;
    }

    async createIngredient({ recipe }) {
        const createdRecipe = await this.mongoDB.create(this.collection, recipe)
        return createdRecipe;
    }
    async updateIngredient ({recipeId, recipe}) {
        const updateRecipeId = await this.mongoDB.update(this.collection, recipeId, recipe)
        return updateRecipeId
    }
    async deleteIngredient({recipeId}) {
        const deletedRecipeId = await this.mongoDB.delete(this.collection, recipeId)
        return deletedRecipeId
    }
}

module.exports = RecipesService;