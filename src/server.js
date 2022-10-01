import express from 'express';
import cors from 'cors';
import routes from './routes/routs.js';

const app = express();

app.use(express.json());
app.use(cors());


app.use(routes);

app.listen(4000, ()=>{
    console.log("Listening on 4000")
})
