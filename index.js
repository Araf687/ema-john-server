const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.xmdkt.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;


console.log(process.env.db_user,process.env.db_pass);


client.connect(err => {
  const collection = client.db("emaJohnStore").collection("products");
  const orderCollection=client.db("emaJohnStore").collection("orders");
  console.log('database connected');
  app.post('/addProduct',(req,res)=>{
      products=req.body;
      // console.log('product:',product);
      collection.insertOne(products)
      .then(result=>{
          console.log('iserted item successfully',result.insertedCount);
          res.send(result.insertedCount);
      })
      .catch(err=>console.log(err))
  })

  app.get('/products',(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  app.get("/product/:key",(req,res)=>{
    collection.find({key: req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })
  app.post("/productByKeys",(req,res)=>{
    const productKeys=req.body; 
    // console.log(productKeys)
    collection.find({key:{ $in: productKeys } })
    .toArray((err,documents)=>{
      // console.log(documents,'hello');
      res.send(documents);
    })

  })
  app.post('/addOrders',(req,res)=>{
    products=req.body;
    // console.log('product:',product);
    orderCollection.insertOne(products)
    .then(result=>{
        console.log('iserted item successfully',result.insertedCount);
        res.send(result.insertedCount>0);
    })
    .catch(err=>console.log(err))
})



  app.get('/', (req, res) => {
    // collection.deleteMany({});
    res.send('Hello ema!')
  })

});


app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})