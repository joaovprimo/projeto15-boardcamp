import connection from "../database/database.js";

export async function postGame (req, res){
    const {name,
    image,
    stockTotal,
    categoryId,
    pricePerDay} = res.locals.game;
   
    try{
        const insert = await connection.query(`INSERT 
        INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)
      `, [name,image,stockTotal,categoryId,pricePerDay]);
      return res.status(201).send("Game criado com sucesso");
     }catch(err){
        return res.status(400).send(err.message);
     }
}

export async function getGames (req, res){
    const games = res.locals.games
    try{
        return res.send(games.rows)
    }catch(err){
        return res.status(400).send(err.message)
    }
}