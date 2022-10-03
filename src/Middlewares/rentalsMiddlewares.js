import connection from "../database/database.js";
import {rentalSchema} from '../Schemas/rentalsSchema.js';

export async function checkPostRentals(req, res, next){
    const {customerId, gameId, daysRented} = req.body;

    const validation = rentalSchema.validate({
        customerId,
        gameId,
        daysRented
    }, {abortEarly: false});
    if(validation.error){
        const errors = validation.error.details.map(det=>det.message);
        return res.status(400).send(errors);
    }

    res.locals.bodyRentals = {
        customerId,
        gameId,
        daysRented
    }
next()
}

export async function checkGameRentals(req, res, next){
   
        //const rentPrice = game.pricePerDay * daysRented;
        
}

export async function checkPostsRentals(req, res, next){
 
//está faltando buscar a quantidade de jogos alugados para ver se o que há em stock é possivel para alugar.
   

}
