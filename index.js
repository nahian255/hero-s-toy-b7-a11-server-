const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyu30gb.mongodb.net/?retryWrites=true&w=majority`;

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
        const db = client.db("toySection");
        const toyCollection = db.collection("toys");

        const indexKeys = { name: 1, price: 1 };
        const indexOptions = { name: "priceingSearch" };
        const result = await toyCollection.createIndex(indexKeys, indexOptions);
        console.log(result);

        app.get("/getToysBySearch/:price", async (req, res) => {
            const text = req.params.price;
            console.log(text);
            const result = await toyCollection
                .find({
                    $or: [
                        { name: { $regex: text, $options: "i" } },
                        { price: { $regex: text, $options: "i" } }
                    ],
                })
                .toArray();
            res.send(result);
        });

        // post toy function....
        app.post('/addtoy', async (req, res) => {
            const body = req.body
            const result = await toyCollection.insertOne(body)
            console.log(result);
            if (result?.insertedId) {
                return res.send(result);
            } else {
                return res.status(404).send({
                    message: "can not insert try again leter",
                    status: false,
                });
            }
        });


        app.get('/alltoys', async (req, res) => {
            const result = await toyCollection.find({}).toArray()
            res.send(result)
        })

        app.get('/mytoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            res.send(result)
        })

        // Get toy using email...
        app.get('/mytoys/email/:email', async (req, res) => {
            const email = req.params.email
            console.log(email);
            const query = { sellerEmail: email }
            const result = await toyCollection.find(query).toArray()
            res.send(result)
        })

        app.put('/mytoys/:id', async (req, res) => {
            const id = req.params.id;
            const toy = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedToys = {
                $set: {
                    price: toy.price,
                    avilableQuantity: toy.avilableQuantity,
                    detail: toy.detail

                }
            }
            const result = await toyCollection.updateOne(filter, updatedToys, options)
            res.send(result)
        })

        app.delete('/mytoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello')
})



app.listen(3000, () => {
    console.log(`it's done`);
})