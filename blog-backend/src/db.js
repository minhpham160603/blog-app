import { MongoClient } from "mongodb";

let db;

const URL = "mongodb://127.0.0.1:27017";

async function connectToDb(cb) {
  const client = new MongoClient(URL);
  await client.connect();
  db = client.db("react-blog-db");
  cb();
}

export { db, connectToDb };
