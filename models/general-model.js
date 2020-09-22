const db = require('../services/connection');

module.exports = (collection, dbUrl) => ({
  createDocument: async (...document) => {
    const result = await (await db(dbUrl))
      .collection(collection)
      .insertOne(document[0]);
    return result;
  },
  updateDocument: async (idDocument, ...document) => {
    const result = await (await db(dbUrl))
      .collection(collection)
      .updateOne({ _id: idDocument },
        { $set: document[0] });
    return result;
  },
  deleteDocument: async (idDocument) => {
    const result = await (await db(dbUrl))
      .collection(collection)
      .deleteOne({ _id: idDocument });
    return result;
  },
  searchDataBase: async (document) => {
    const result = await (await db(dbUrl))
      .collection(collection)
      .findOne(document);
    return result;
  },
  showListCollections: async (skip, limit) => {
    const result = await (await db(dbUrl))
      .collection(collection)
      .find({}).skip(skip)
      .limit(limit)
      .toArray();
    return result;
  },
});
