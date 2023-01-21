const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const { json } = require("express");
const mongoClient = mongodb.MongoClient;
const app = express();
const URL =
  "mongodb+srv://kat369:Kathiravan1995@project-m-tool.xjuxrpd.mongodb.net/?retryWrites=true&w=majority";
const DB = "shopping-app";

let users = [];

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);



app.get("/products", async function (req, res) {

  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let products = await db
      .collection("products")
      .find()
      .toArray();

    await connection.close();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.get("/user/:id", async function (req, res) {

    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let user = await db
        .collection("user")
        .findOne({ _id: mongodb.ObjectId(req.params.id) });
  
      await connection.close();
    
      res.json(user.cart);
    } catch (error) {
      res.status(500).json({ message: "try again later" });
    }
  });
  

app.post("/addtocart/:id", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let item = await db.collection("user").updateOne(
        {
          _id: mongodb.ObjectId(req.params.id)
        },
        { $push: { cart: req.body.data} }
      );
  
      
      await connection.close();
  
      res.json({ message: "item added succesfully " });
    } catch (error) {
      res.status(500).json({ message: "try again later" });
    }
  });

  app.post("/removefromcart/:id", async function (req, res) {
    console.log(req.body.data)
      try {
        const connection = await mongoClient.connect(URL);
    
        const db = connection.db(DB);
    
        let item = await db.collection("user").updateOne(
          {
            _id: mongodb.ObjectId(req.params.id)
          },
          { $pull: { cart: req.body.data} }
        );
    
        
        await connection.close();
    
        res.json({ message: "item removed succesfully " });
      } catch (error) {
        res.status(500).json({ message: "try again later" });
      }
    });
  

app.listen(process.env.PORT || 3005);