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

export async function checkGetGameRentals(req, res, next){
    const {customerId, gameId} = req.query;
        console.log(customerId, gameId);
    try{
        if(customerId && gameId){
            const rentById = await connection.query(`SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name)
            AS customer,
            json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name)
            AS game
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id
            WHERE rentals."customerId" = $1 AND rentals."gameId" = $2
            ;`, [customerId, gameId]);
           
            res.locals.rentals = rentById;
        }
        else if(customerId && !gameId ){
            const rentById = await connection.query(`SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name)
            AS customer,
            json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name)
            AS game
            FROM rentals 
            JOIN customers
            ON  rentals."customerId"= customers.id
            JOIN games 
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id
            WHERE 
            rentals."customerId" = $1;`, [customerId]);
            
            res.locals.rentals = rentById;
        }
        else if(!customerId && gameId ){
            const rentById = await connection.query(`SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name)
            AS customer,
            json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name)
            AS game
            FROM rentals 
            JOIN customers
            ON  rentals."customerId"= customers.id
            JOIN games 
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id
            WHERE 
            rentals."gameId" = $1;`, [gameId]);
            
            res.locals.rentals = rentById;
        }
        else{
            const rentById = await connection.query(`SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name)
            AS customer,
            json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name)
            AS game
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id
            ;`);
           
            res.locals.rentals = rentById;
        }

    }catch(err){
        return res.status(400).send(err.message);
    }
        
       next() 
}

export async function checkReturnGameRentals(req, res, next){
const {id} = req.params;
console.log(id)
try{
    const idRental = await connection.query(`SELECT * 
    FROM rentals 
    WHERE id = $1`, [id]);
    if(!idRental){
        return res.status(404).send("Aluguel não detectado");
    }
    const checkAlreadyReturned = idRental.rows[0].returnDate;
    if(checkAlreadyReturned ===  null){
        res.locals.rentalending = idRental;
    }

}catch(err){
    return res.status(400).send(err.message);
}
next();
}

export async function checkDeleteGameRentals(req, res, next){
    const {id} = req.params;
    console.log(id)
    try{
        const idRental = await connection.query(`SELECT * 
        FROM rentals 
        WHERE id = $1`, [id]);
        if(!idRental){
            return res.status(404).send("Aluguel não detectado");
        }
        const checkAlreadyReturned = idRental.rows[0].returnDate;
        if(checkAlreadyReturned !==  null){
            res.locals.rentaldeleting = idRental;
        }
    
    }catch(err){
        return res.status(400).send(err.message);
    }
    next();
    }
    