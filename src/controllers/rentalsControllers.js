import connection from "../database/database.js";
import dayjs from "dayjs";

export async function postRentals(req, res){
    const {customerId, gameId, daysRented} = res.locals.bodyRentals;
    const today = dayjs(). format('YYYY-MM-DD');
    console.log(today)

    try{
        const client = await connection.query(`SELECT *
        FROM customers
        WHERE id = $1
        `, [customerId]);
        const game = await connection.query(`SELECT *
        FROM games
        WHERE id = $1
        `, [gameId]);
        if(client.rowCount === 0){
            return res.status(400).send("Usuário não encontrado.");
        }
        if(game.rowCount === 0){
            return res.status(400).send("Jogo não encontrado.");
        }
        

        const checkAvailableRentals = await connection.query(`SELECT * 
        FROM rentals 
        WHERE "gameId" = $1 AND "returnDate" IS null;`, [gameId]);

        if(checkAvailableRentals.rowCount > 0 && game.rows[0].stockTotal === checkAvailableRentals.rowCount){
            return res.status(400).send("Jogo não está disponível para se alugado");
        }

        const originalPrice = game.rows[0].pricePerDay * daysRented;

        await connection.query(`INSERT
         INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
         VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [customerId, gameId, today, daysRented, null, originalPrice, null]);

        return res.status(201).send("Alguel realizado com sucesso");
    }catch(err){
        return res.status(400).send(err.message);
    }


}