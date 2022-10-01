import express from 'express';
import cors from 'cors';
import connection from './database/database.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res)=>{
    console.log("foi")
    //const query = connection.query...
})

app.listen(4000, ()=>{
    console.log("Listening on 4000")
})
