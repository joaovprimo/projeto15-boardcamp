import connection from "../database/database.js";

export async function getCategories(req,res){
    const categories = res.locals.categories;
  try{
    return res.send(categories.rows);
  } catch(err){
    return res.status(400).send(err.message);
  }
}

export async function postCategories(req, res){
    const categories = res.locals.categorycreated;
    try{
      const insert =  await connection.query(`INSERT 
        INTO categories (name)
        VALUES ($1)`, [categories.name]);
       return res.status(201).send("Categoria criada");
    }catch(err){
        return res.status(400).send(err.message);
    }
   
   

}
