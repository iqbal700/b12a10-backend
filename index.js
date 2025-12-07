const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w0obvc9.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {

  try {
    await client.connect();

    const database = client.db('petService');
    const petServices = database.collection('services');
    const orderCollections = database.collection('orders');

       // ==-== post or save service to database ==-== //
    app.post('/services', async(req, res) => {
        const data = req.body;
        console.log(data)
        const result = await petServices.insertOne(data)
        res.send(result)
    })

    // ==-== get service from database ==-== //
    app.get('/services', async(req, res) => {
      const {category} =  req.query;
        const query = {};
        if(category) {
          query.category = category
        }
        const result = await petServices.find(query).toArray();
        res.send(result)
    })

    // ==-== To show specific card details in another page based on click ==-== // 

    app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await petServices.findOne(query)
        if (!result) {
        return res.status(404).send({ message: "Service not found" });
    }
        res.send(result)
    })

    app.get('/my-services', async(req, res) => {
       const {email} = req.query;
       console.log(email)
       const query = {email: email}
       const result = await petServices.find(query).toArray()
       res.send(result)
    })

    // ==-== update/Edit listing item ==-== //

    app.put('/update/:id', async(req, res) => {
      const data = req.body;
      const id = req.params;
      const query =  {_id: new ObjectId(id)}
      const updateServices = {
        $set: data
      }
      const result = await petServices.updateOne(query, updateServices)
      res.send(result)
    })

// ==-== Delete Listing Item ==-== //

app.delete('/delete/:id', async(req, res) => {
    const id = req.params;
     const query =  {_id: new ObjectId(id)};
      const result = await petServices.deleteOne(query)
      res.send(result)

})


// =-= Create Order Listing =-= //
 app.post('/orders', async(req, res) => {
     const data = req.body;
     console.log(data);
     const result = await orderCollections.insertOne(data);
     res.send(result);

 })

 // ==-== now get the order list that i create ==-== //

 app.get('/orders', async(req, res) => {
    const result = await orderCollections.find().toArray();
    res.send(result);

 })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('hello, developers')
})

app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})

