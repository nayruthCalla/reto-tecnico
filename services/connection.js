const { MongoClient } = require('mongodb');

let db = null;

module.exports = async (dbUrl) => {
  if (!db) {
    const client = new MongoClient(dbUrl, {useUnifiedTopology: true});
    try {
      await client.connect();
      db = await client.db();
      console.info('base de datos conectada');
      return db;
    } catch (err) {
      console.info(err.stack);
    }
  }
  return db;
};
