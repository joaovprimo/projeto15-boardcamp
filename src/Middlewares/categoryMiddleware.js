import connection from "../database/database.js";

export async function existCategories(req, res, next){
try{
    const categories = await connection.query(`SELECT * 
    FROM categories;
    `)
    if(!categories){
        return res.status(400).send("Não há categorias disponíveis");
    }
    res.locals.categories=categories;
}catch(err){
    return res.send(err.message)
}
next();
}

export async function nameCategories (req,res, next){
    const category = req.body;
try{
    if(category.name === ""){
        return res.status(400).send("O nome da categoria deve ser preenchido");
    }

    const selectCategories = await connection.query(`SELECT *
    FROM categories;
    `);
    const checkCategories = selectCategories.rows.find(cat => cat.name === category.name);

    if(checkCategories){
        return res.status(409).send("Esta categoria já existe!");
    }else{
        res.locals.categorycreated = category;
    }
}catch(err){
    return res.status(400).send(err.message);
}
next();
}

