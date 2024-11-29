import express, { json } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config(
    {
        path: "../.env"
    }
);

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = process.env.PORT || 3000;
app.use(cors())
app.use(json());

const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true })


client.connect((error, client) => {
    if(error){
        return console.log('Unable to connect to database')
    }
    console.log(`Connected correctly`)
});



app.post('/upload', async (req, res) => {
    try {
        const dbName = "esp32";
        const collectionName = "images";
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const image = req.body.image
        await collection.updateOne(
            { _id: new ObjectId(process.env.ID) },
            { $set: { image: image } },
            { upsert: true }
        )
        res.send('Image uploaded successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading image');
    }
});

app.get("/", (req, res) => {
    res.send('Hello World')
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});