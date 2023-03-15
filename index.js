const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hq31bdr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        const serviceCollection = client.db("bookStore").collection("items");
        // const orderCollection = client.db("bookStore").collection("orders");

        app.get("/inventories", async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/inventories/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        app.get("/myItems", async (req, res) => {
          let query = {}
          if(req.query.email){
            query = {
              email: req.query.email
            }
          }
          const cursor = serviceCollection.find(query)
          const result = await cursor.toArray();
          res.send(result);
        })

        // // create api
        app.post ("/inventories", async (req, res) => {
          const order = req.body;
          const result = await serviceCollection.insertOne(order)
          res.send(result);
        });

        app.delete("/inventories/:id", async (req, res) => {
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
          const result = await serviceCollection.deleteOne(query)
          res.send(result);
        });
        
    }
    finally{

    }
}
run().catch((err) => console.error(err));


app.get("/", (req, res) => {
  res.send("Yay, My server is working");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
