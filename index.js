const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// ------------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vkykc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// -------------------------------------------
async function run() {
    try {
        await client.connect();
        const database = client.db('wooden_furniturs');
        const productsCollection = database.collection('products');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users');


        // products api--get--------
        app.get("/products", async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.limit(6).toArray();
            res.send(result);


        })
        app.get("/allproducts", async (req, res) => {
            const result = await productsCollection.find({}).toArray()
            res.send(result);


        })

        app.get("/purchase/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);

            res.send(result)

        })

        // add & delete product api--------------------

        app.post('/AddProducts', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
        });

        app.delete("/allproducts/:id", async (req, res) => {
            const result = await productsCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });



        // reviews api-----------------------
        app.post('/Addreviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);

            res.json(result)
        });

        app.get("/reviews", async (req, res) => {
            const result = await reviewCollection.find({}).toArray()
            res.send(result);


        })

        // oders api---------------------
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.json(result)
        });

        app.get("/orders/:email", async (req, res) => {
            const result = await orderCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        });

        app.delete("/orders/:id", async (req, res) => {
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // Product manage-------------

        app.get("/orderManagment", async (req, res) => {
            const result = await orderCollection.find({}).toArray()
            res.send(result);

        })
        app.delete("/orderManagment/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })
        // update status---------------------------

        app.put("/status/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            const result = await orderCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);

        });

        // admin--------------
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result)
        });


        app.put("/admin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await userCollection.find(filter).toArray();
            if (result) {
                const result = await userCollection.updateOne(filter, {
                    $set: { role: "admin" },
                });

            }
        });

        app.get("/admin/:email", async (req, res) => {
            const result = await userCollection
                .find({ email: req.params.email })
                .toArray();

            res.send(result);
        });











    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('welcome exclusive chair shop')
})

app.listen(port, () => {
    console.log(`I am listening at ${port}`)
})