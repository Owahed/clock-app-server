const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId =require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()



const port = process.env.PORT || 5000;



app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y1wap.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("clock123456").collection("Services");
  const orderCollection = client.db("clock123456").collection("order");
  const reviewCollection = client.db("clock123456").collection("review");
  const adminCollection = client.db("clock123456").collection("admin");
//----------------------eventCollection---------------
  app.get('/services', (req, res) => {
    eventCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  app.post("/addService", (req, res) => {
    const newService = req.body;
    eventCollection.insertOne(newService)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('/delete/:id',(req,res)=>{
    eventCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
       res.send(result.deletedCount>0);
    })
})

//--------------------------orderCollection---------------
  app.post('/order', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0);
      })

  });

  app.get('/userServices', (req, res) => {
    orderCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/allServices', (req, res) => {
    orderCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

//-------------------------reviewCollection------------
  app.post('/review', (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0);
      })

  });

  app.get('/allReview', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  //-------------------------admin-----------------

  app.post('/adminEmail', (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0);
      })

  });

  // app.post('/isAdmin', (req, res) => {
  //   adminCollection.find({ email: req.query.email })
  //     .toArray((err, documents) => {
  //       res.send(documents.length>0);
  //     })
  // })

  app.get('/isAdmin', (req, res) => {
    const email=req.query.email;
    adminCollection.find({ email: email })
      .toArray((err, documents) => {
        // console.log(documents.email)
        // if (documents.length>0) {
          res.send(documents);
          
        // }
       
      })
  })




});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})