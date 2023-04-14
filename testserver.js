// Define "require"
import module from "module"
const require = module.createRequire(import.meta.url)

const mysql = require('mysql')
 
const pool = mysql.createPool({
    connectionLimit: 10,    
    password: 'root',
    user: 'root',
    database: 'kaspichessdb',
    host: 'localhost',
    port: 3306
 
})

//Example of queries in a sequential flow
async function SelectFromTree(){
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM tree',  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

async function InsertIntoTree(){
    return new Promise((resolve, reject)=>{
        pool.query("INSERT INTO tree (NodoPadre,FEN) VALUES ('0','Hola')",  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

for (let i = 0; i < 4; i++) {

    try{
        const result1 = await SelectFromTree();
        const result2 = await InsertIntoTree();
        // here you can do something with the three results
        console.log(result1)
        console.log('---------')
        console.log(result2)
    } catch(error){
        console.log(error)
    }

}