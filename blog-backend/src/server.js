import fs from "fs";
import admin from "firebase-admin";
import express from "express";
import { db, connectToDb } from "./db.js";

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({ credential: admin.credential.cert(credentials) });

// let articlesInfo = [
//   {
//     name: "learn-react",
//     upvotes: 0,
//     comments: [],
//   },
//   {
//     name: "learn-node",
//     upvotes: 0,
//     comments: [],
//   },
//   {
//     name: "mongodb",
//     upvotes: 0,
//     comments: [],
//   },
// ];

//PUT /articles/learn-react/upvote

const app = express();

app.use(express.json()); //this is to run middleware to read json request

app.use(async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  const { authtoken } = req.headers;
  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400);
    }
  }
  req.user = req.user || {};

  next();
});

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.includes(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401); //not allowed
  }
});

app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;
  // console.log(req);

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);
    // console.log(req.user);
    if (canUpvote) {
      await db.collection("articles").updateOne(
        { name },
        {
          $inc: { upvotes: 1 },
          $push: { upvoteIds: uid },
        }
      );
    }
    const updatedArticle = await db.collection("articles").findOne({ name });
    res.json(updatedArticle);
  } else {
    res.send("Article doesn't exist!");
  }
});

app.put("/api/articles/:name/downvote", async (req, res) => {
  const { name } = req.params;

  await db.collection("articles").updateOne(
    { name },
    {
      $inc: { upvotes: -1 },
    }
  );

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.send(article);
  } else {
    res.sendStatus(404);
  }
});

//Comment
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;
  console.log(email);

  await db.collection("articles").updateOne(
    { name },
    {
      $push: { comments: { postedBy: email, text } },
    }
  );

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.json(article);
  } else {
    res.send("Article not exist!");
  }
});

//Clear comment
app.put("/api/articles/:name/comments/clear", async (req, res) => {
  const { name } = req.params;
  await db.collection("articles").updateOne(
    { name },
    {
      $set: { comments: [] },
    }
  );
  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.json(article);
  } else {
    res.send("Article not exist!");
  }
});

connectToDb(() => {
  console.log("Succesfully connected to database.");
  app.listen(8000, () => {
    console.log("Listening on port 8000");
  });
});
