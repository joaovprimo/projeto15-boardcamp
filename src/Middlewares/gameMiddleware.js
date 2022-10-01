import connection from "../database/database.js";

export async function checkPostgame(req, res, next){
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;  
    try{
        if(!name){
            return res.status(400).send("O nome do jogo deve ser preechido!");
        }
        if(stockTotal <= 0 && pricePerDay <=0 ){
            return res.status(400).send("Os campos pricePerDay e stockTotal devem ser maiores que 0");  
        }
        const existsIdCategory = await connection.query(`SELECT * FROM categories WHERE id = ($1)`, [categoryId])
        if(!existsIdCategory){
            return res.status(400).send("A categoria de jogo escolhida não existe!");
        }
        const namesGames = await connection.query(`SELECT * FROM games;`);

        const checkNamesGames = namesGames.rows.find(cat => cat.name === name);

        if(checkNamesGames){
            return res.status(409).send("Este Nome de jogo já existe!");
        }

        const newObjGame = {
            name,
            image,
            stockTotal,
            categoryId,
            pricePerDay
        }

        res.locals.game = newObjGame;
    }catch(err){
        console.log("erro aqui no mid")
        return res.status(400).send(err.message);
    }
next()
}

export async function checkGetgame (req, res, next){
try{
    const games = await connection.query(`SELECT games.*, categories.name as "name_categories"  
    FROM games
    JOIN categories 
    ON games."categoryId" = categories.id;
    `)

    if(!games){
        return res.status(400).send("Ainda não existem jogos cadastrados")
    }
    res.locals.games = games;

}catch(err){
return res.status(400).send(err.message);
}
next()
}