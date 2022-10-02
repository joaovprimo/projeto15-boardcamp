import express from 'express';
import cors from 'cors';
import routesCategory from './routes/routsCategory.js';
import routesGame from './routes/routsGame.js';
import routesClients from './routes/routsClients.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(routesCategory);
app.use(routesGame);
app.use(routesClients)

app.listen(4000, ()=>{
    console.log("Listening on 4000")
})
