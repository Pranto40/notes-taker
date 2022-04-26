const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqnk1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");


        // get api to read all notes
        // http://localhost:5000/notes
        app.get('/notes', async (req, res) => {
            const query = {};

            const cursor = notesCollection.find(query);

            const result = await cursor.toArray();

            res.send(result)
        })

        // creacte notesTaker
        // http://localhost:5000/note
        /*
         body {
            "userName": "pranto",
            "data": "hello word"
           }
        */
        app.post('/note', async (req, res) => {
            const data = req.body
            const result = await notesCollection.insertOne(data)
            res.send(result)
        })

        // update notesTaker
        // http://localhost:5000/note/62677cdf7a2e2c07b0d6f763
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log(data);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // ...data
                     userName: data.userName,
                     data: data.data 
                },
              };
              const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        // delete notesTaker
        // http://localhost:5000/note/62677cdf7a2e2c07b0d6f763
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };

            const result = await notesCollection.deleteOne(filter);
            res.send(result);
        })




        console.log('connected to db');
    }
    finally{
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