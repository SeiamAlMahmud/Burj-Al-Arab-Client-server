const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000
const app = express()
require('dotenv').config();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://burj-al-arab-client.vercel.app/"
    ],
    // methods: "GET,POST,PUT,DELETE",/
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json())
app.use(express.json())

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
    const usersCollection = database.collection("users")

    app.post('/addBooking', async (req, res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking)
      console.log(newBooking)
      res.send(result)
    })
    app.get('/getBooking', async (req, res) => {
      const result = await bookingCollection.find({}).toArray()
      res.send(result)
    })
    app.get('/getBooking/:id', async (req, res) => {
      const id = req.params.id;

      const result = await bookingCollection.find({ _id: new ObjectId(id) }).toArray()
      res.send(result)
    })
    app.get('/login/token',  (req, res) => {
      const authToken = req.headers.authorization?.split(' ')[1];
      console.log(authToken)

         // const verifyJWT = (req, res, next) => {
      //   const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

      //   if (!token) {
      //     return res.status(401).json({ message: 'Unauthorized' });
      //   }

      //   try {
      //     const decoded = jwt.verify(token,  process.env.SECRET_KEY);
      //     req.userToken = decoded.userToken; // Attach decoded user ID to the request object
      //     next();
      //   } catch (error) {
      //     res.status(401).json({ message: 'Unauthorized' });
      //   }
      // }
     

      res.send(authToken)
    })


    app.post('/api/login', async (req, res) => {
      const indivisualUser = req.body;
      try {
        const result = await usersCollection.find({ uid: indivisualUser.uid }).toArray();
        if (result.length === 0) {
          const result = await usersCollection.insertOne(indivisualUser)
          console.log(result)
        } else {

          // Generate JWT token
          const token = jwt.sign({ userToken: result[0] }, process.env.SECRET_KEY, { expiresIn: '1h' });
          res.json({ token });


          //  res.send(req.body)
        }
      }
      catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
   
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