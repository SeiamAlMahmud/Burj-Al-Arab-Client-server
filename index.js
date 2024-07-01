const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()
require('dotenv').config();
app.use(cors())
app.use(bodyParser.json())
// app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@first-project.dkbbjak.mongodb.net/?retryWrites=true&w=majority&appName=First-Project`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");



    const database = client.db("bookingdb")
    const bookingCollection = database.collection("booking")

    app.post('/addBooking', async (req,res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking)
      console.log(newBooking)
      res.send(result)
    })
    app.get('/getBooking', async (req,res) => {
      const result = await bookingCollection.find({}).toArray()
      res.send(result)
    })
    app.get('/getBooking/:id', async (req,res) => {
      const id = req.params.id;

      const result = await bookingCollection.find({_id: new ObjectId(id)}).toArray()
      res.send(result)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})