const MongoLib = require('../lib/mongo');

class RecipesService {
    constructor() {
        this.collection = 'recipes';
        this.mongoDB = new MongoLib();
    }
  // db.getCollection('ingredients').find({$text: { $search: "Tomato jalapeño"}},{score: { $meta: "textScore"}}).sort({score: {$meta: "textScore"}})
    async getRecipes () {
        const recipes = await this.mongoDB.getAll(this.collection, {})
        return recipes || []
    }
    async getUserRecipes({userId}) {
        const query = userId && {userId}
        const recipes = await this.mongoDB.getAll(this.collection, query)
        return recipes || []
    }
    async searchRecipe({text, userId}) {
        const query = { $text: {$search: text}, userId}
        const sort = {score: {$meta: "textScore"}}
        const projection = {
            name: 1,
            ingredients: 1, 
            weight: 1,
            userId: 1,
            score: { $meta: "textScore"}
        }
        const recipes = await this.mongoDB.search(this.collection, query, sort, projection)
        return recipes || []
    }
    async getOwnRecipe ({ recipeId, userId}) {
        
        const recipe = await this.mongoDB.getOwn(this.collection, recipeId, userId);
        return recipe;
    }
    async getRecipe ({ recipeId }) {
        
        const recipe = await this.mongoDB.get(this.collection, recipeId);
        return recipe;
    }
    async createRecipe({ recipe }) {
        const createdRecipe = await this.mongoDB.create(this.collection, recipe)
        return createdRecipe;
    }
    async updateRecipe ({recipeId, recipe}) {
        const updateRecipeId = await this.mongoDB.update(this.collection, recipeId, recipe)
        return updateRecipeId
    }
    async deleteRecipe({recipeId}) {
        const deletedRecipeId = await this.mongoDB.delete(this.collection, recipeId)
        return deletedRecipeId
    }
}

module.exports = RecipesService;