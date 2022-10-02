import connection from "../database/database.js";

export async function postCustomers(req, res){
const {name, phone, cpf, birthday } = res.locals.clients;
console.log(birthday);

try{
    const checkCPF = await connection.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);
    console.log(checkCPF.rows)
    if(checkCPF.rows.length !==0){
        return res.status(409).send("Já existe um usuário com este cpf!");
    }else{
    const Insetcustomer = await connection.query(`INSERT 
    INTO customers(name, phone, cpf, birthday) 
    VALUES ($1, $2, $3, $4)
    `, [name, phone, cpf, birthday]);

    return res.status(201).send("Cliente criado com sucesso!");}
}catch(err){
 return res.status(400).send(err.message);
}

}

export async function getCustomers(req, res){
    const clients = res.locals.customers;
    try{
        return res.send(clients.rows)
    }catch(err){
        return res.status(400).send(err.message);
    }
}

export async function getCustomersID(req,res){
    const clients =  res.locals.clientId;
    try{
        return res.send(clients.rows);
    }catch(err){
        return res.status(400).send(err.message);
    }
}

export async function putCustomersID(req,res){
    const {id_customer} = req.params;
    const {name, phone, cpf, birthday} = res.locals.data;
  
    try{
       const updated = await connection.query(`UPDATE customers
       SET name = $1, phone = $2, cpf = $3, birthday = $4
       WHERE id = $5`, [name, phone, cpf, birthday, id_customer]);
       return res.status(200).send("Atualização realizada com sucesso!")
    }catch(err){
        return res.status(400).send(err.message)
    }
}