import { clientSchema } from "../Schemas/clientsSchema.js";
import connection from "../database/database.js";

export async function checkPostClient (req, res, next){
const {name, phone, cpf, birthday} = req.body;

const validation = clientSchema.validate({
    name,
    phone,
    cpf,
    birthday
}, {abortEarly: false});

if(validation.error){
    const errors = validation.error.details.map(det=>det.message);
    return res.status(400).send(errors);
}

res.locals.clients = {name, phone, cpf, birthday};
   next();

}

export async function checkGetClients(req, res, next){
        const {cpf} = req.query;
        console.log(cpf);
        const cpfs = `${cpf}%`;
    try{
        if(cpf){
        const clientscpf = await connection.query(`SELECT *
         FROM customers WHERE cpf LIKE $1
        `, [cpfs]);
        res.locals.customers = clientscpf;
        }else{
        const clients = await connection.query(`SELECT *
        FROM customers;
        `);
        if(!clients){
            return res.status(400).send("Não existem usuários cadastrados");
        }
          res.locals.customers = clients;}
    }catch(err){
        return res.status(400).send(err.message);
    }
    next();
}

export async function checkGetClientsID(req, res, next){
    const {id_customer} = req.params;
   
    try{
        const clientID = await connection.query(`SELECT *
        FROM customers
        WHERE id = $1
        `, [id_customer]);
        if(clientID.rows.length !==0){
            res.locals.clientId = clientID;
        }else{
            return res.status(404).send("Cliente com este ID inexistente")
        }
    }catch(err){
        return res.status(400).send(err.message);
    }
next()
}

export async function checkUpdateClientsID (req, res, next){
    const {id_customer} = req.params;
    const {name, phone, cpf, birthday} = req.body;
    const validation = clientSchema.validate({
        name,
        phone,
        cpf,
        birthday
    }, {abortEarly: false});
    
    if(validation.error){
        const errors = validation.error.details.map(det=>det.message);
        return res.status(400).send(errors);
    }
    try{
        const customerUpdating = await connection.query(`SELECT * 
        FROM customers 
        WHERE  id = $1`, [id_customer]);
        const checkcpfUpdating = await connection.query(`SELECT * 
        FROM customers 
        WHERE  cpf = $1`, [cpf]);

        if(checkcpfUpdating.rows.length === 0){
            console.log("aqui1")
            res.locals.updating = customerUpdating;
            res.locals.data = {name,
                phone,
                cpf,
                birthday};
        }
        else if(customerUpdating.rows[0].id === checkcpfUpdating.rows[0].id){
            console.log("aqui2")
            res.locals.updating = customerUpdating;
            res.locals.data = {name,
                phone,
                cpf,
                birthday};
        }else{
          return res.status(409).send("Operação inválida, este cpf pertence a outro usuário");
        }
    }catch(err){
       return res.send(err.message)
    }
    next()
}