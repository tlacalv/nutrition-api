const MongoLib = require('../lib/mongo');

class IngredientsService {
    constructor() {
        this.collection = 'ingredients';
        this.mongoDB = new MongoLib();
    }
    async getIngredients () {
        const ingredients = await this.mongoDB.getAll(this.collection, {})
        return ingredients || []
    }
    async getUserIngredients ({userId}) {
        const query = userId && {userId}
        const ingredients = await this.mongoDB.getAll(this.collection, query)
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