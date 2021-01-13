const MongoLib = require('../lib/mongo');

class IngredientsService {
    constructor() {
        this.collection = 'ingredients';
        this.mongoDB = new MongoLib();
    }
  // db.getCollection('ingredients').find({$text: { $search: "Tomato jalapeño"}},{score: { $meta: "textScore"}}).sort({score: {$meta: "textScore"}})
    async getIngredients () {
        const ingredients = await this.mongoDB.getAll(this.collection, {})
        return ingredients || []
    }
    async getUserIngredients ({userId}) {
        const query = userId && {userId}
        const ingredients = await this.mongoDB.getAll(this.collection, query)
        return ingredients || []
    }
    async searchIngredient ({text}) {
        const query = { $text: {$search: text}}
        const sort = {score: {$meta: "textScore"}}
        const projection = {
            name: 1,
            calories: 1, 
            fat: 1,
            carbohydrate: 1,
            protein: 1,
            userId:1,
            score: { $meta: "textScore"}
        }
        const ingredients = await this.mongoDB.search(this.collection, query, sort, projection)
        return ingredients || []
    }
    async getIngredient ({ ingredientId }) {
        
        const ingredient = await this.mongoDB.get(this.collection, ingredientId);
        return ingredient;
    }

    async createIngredient({ ingredient }) {
        const createdIngredient = await this.mongoDB.create(this.collection, ingredient)
        return createdIngredient;
    }
    async updateIngredient ({ingredientId, ingredient}) {
        const updateIngredientId = await this.mongoDB.update(this.collection, ingredientId, ingredient)
        return updateIngredientId
    }
    async deleteIngredient({ingredientId}) {
        const deletedIngredientId = await this.mongoDB.delete(this.collection, ingredientId)
        return deletedIngredientId
    }
}

module.exports = IngredientsService;