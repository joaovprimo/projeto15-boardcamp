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

export async function getRentals(req, res){
    const rentals = res.locals.rentals;
     try{
        return res.status(200).send(rentals.rows)
     }catch(err){
        return res.status(400).send(err.message)
     }
}

export async function returnRentals (req, res){
    const today = dayjs(). format('YYYY-MM-DD');
    const endingRent = res.locals.rentalending;
    const id = endingRent.rows[0].id;
    const daysRented = endingRent.rows[0].daysRented;
    let returningDate = endingRent.rows[0].returnDate;
    try{
    if(returningDate - endingRent.rows[0].rentDate === 0){
        returningDate = today + 1; 
    }else{
        returningDate = today
    }
    const differenceReturned = (returningDate - endingRent.rows[0].rentDate);
    let delayFeereturn = endingRent.rows[0].delayFee
    if(differenceReturned > daysRented ){
      delayFeereturn  =  (differenceReturned * ((endingRent.rows[0].originalPrice)/(daysRented)));
    }

    await connection.query(`UPDATE rentals
    SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3
    `, [today, delayFeereturn, id ]);

    return res.status(200).send("Jogo devolvido com sucesso!");}
    catch(err){
        return res.status(400).send(err.message);
    }
}

export async function deleteRentals (req, res){
    const deleting = res.locals.rentaldeleting.rows[0];
    console.log(deleting.id);

    try{
        const deleteRent = await connection.query(`DELETE 
        FROM rentals 
        WHERE id = $1`, [deleting.id]);
        return res.status(200).send('Aluguel deletado com sucesso');
    }catch(err){
        return res.status(400).send(err.message);
    }
    
}

