const MongoLib = require('../lib/mongo');
const bycrop = require('bcrypt');

class UsersService {
    constructor( ) {
        this.collection = 'users';
        this.mongoDB = new MongoLib();
    }
    async getUser ({ email }) {
        
        const [ user ] = await this.mongoDB.getAll(this.collection, { email });
        return user;
    }

    async createUser({ user }) {
        const { name, email, password, role } = user;
        const hashedPassword = await bycrop.hash(password, 10);

        const createUserId = await this.mongoDB.create(this.collection, {
            name,
            email,
            password: hashedPassword,
            role
        });
        return createUserId;
    }
    async getOrCreateUser({ user }) {
        const queriedUser = await this.getUser({ email: user.email});

        if(queriedUser) {
            return queriedUser;
        }

        await this.createUSer({ user });
        return await this.getUser({ email: user.email});
    }
}

module.exports = UsersService;