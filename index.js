const os = require('os');
const express = require('express');
const {MongoClient}  = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4oeg1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("foodPanda");
      const usersCollection = database.collection("users");
    //   post api
      app.post('/users', async (req, res) => {
      const newUser = req.body;
    //insert into database
      const result = await usersCollection.insertOne(newUser);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result)
      })
    // get api
    app.get('/users', async (req, res) => {
        const curson = usersCollection.find({});
        const users = await curson.toArray();
        res.send(users)
    })
    app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await usersCollection.findOne(query);
        console.log(result);
        res.json(result)
    })
    // delete api
    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        console.log(result)
        res.json(result)
    })
    //update api
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      console.log(result);
      res.json(result)
    })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Excercises with node, database')
})


// fs.appendFileSync('test.txt', 'I am from bd')
// const content = fs.readFileSync('test.txt');
// console.log(content.toString());

app.listen(port, ()=>{
    console.log('listening app this port', port)
})