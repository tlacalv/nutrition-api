const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config')

const USER = encodeURIComponent(config.dbUser)
const PASSWORD = encodeURIComponent(config.dbPassword)
const DB_NAME = config.dbName;
const debug = require("debug")("app:db");

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    //creamos el cliente con el mongo client
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology:true })
    //guardamos el nombre de la base de datos
    this.dbName = DB_NAME;

  }
  connect() {
    //verificamos si ya existe la conexion
    if (!MongoLib.connection) {
      //creamos la conexion con una promesa
      MongoLib.connection = new Promise((resolve, reject) => {
        //usamos el cliente ya definido para conectarnos
        this.client.connect(err => {
          if (err) {
            reject(err)
          }
          debug('Connected succesfullu to mongo');
          //regresamos el cliente con la db attached
          resolve(this.client.db(this.dbName));
        });
      });
    }
    return MongoLib.connection;
  }
  getAll(collection, query) {
    return this.connect()
      .then(db => {
        return db.collection(collection).find(query).toArray();
      })
  }
  search(collection, query, sort, projection) {
    return this.connect()
      .then(db => {
        return db.collection(collection).find(query).sort(sort).project(projection).toArray();
      })
  }
  get(collection, id) {
    return this.connect()
      .then(db => {
        return db.collection(collection).findOne({ _id: ObjectId(id) });
      })
  }
  getOwn(collection, id, userId) {
    return this.connect()
      .then(db => {
        return db.collection(collection).findOne({ _id: ObjectId(id), userId });
      })
  }
  create(collection, data) {
    return this.connect()
      .then(db => {
        return db.collection(collection).insertOne(data);
      })
      .then(result => result.insertedId);
  }
  update(collection, id, data) {
    return this.connect()
      .then(db => {
        return db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then(result => result.upsertedId || id)
  }
  delete(collection, id) {
    return this.connect()
      .then(db => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id)
  }
  deleteByParam(collection, param, value) {
    return this.connect()
      .then(db => {
        return db.collection(collection).deleteOne({ [param]:value });
      })
      .then((result) => result)
  }
}
module.exports = MongoLib