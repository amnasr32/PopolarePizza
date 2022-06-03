

/********************** Un fichier test qui contient tout les fonctions de maj du panier*****************/

const  pg = require('pg')
const pool = new pg.Pool({
    user: 'amnasr',
    host: 'localhost',
    database: 'popolare',
    password: 'FacoupMy', // accès à une information externe
    //port: 8080,
    queueLimit : 0, // unlimited queueing
    connectionLimit : 0 // unlimited connections 

    });
    let results = {
        pizza : [], 
        entree : [], 
        menu: [], 
        pizza_base: [],
        pizza_ingredients : [],
        boisson : [],
        dessert : [],
        panier : []
        

    };


    /***** foonction qui retourne la table panier */
    async function operation (){
            try {
                await pool.connect();
                console.log('connected')
                
                results.boisson = await client.query('SELECT * FROM panier', (err, res) => {
                    return res.rows;
                    client.end()
                });
            }
            catch (error) {
                console.error(error.stack);
            }
    }




/**************   Suppression d'un produit dans la bdd*********************/
async function delete_item (elem){

    console.log("Fonction de suppression d'un produit de la bdd")
    try {
        await pool.connect();
        console.log("Contenu de la table avant suppression: ")
        results.panier = pool.query('SELECT * FROM panier', (err, res) => {
        console.log(res.rows)
        if(exists_el(res.rows,elem)){  
            var del =pool.query('DELETE FROM panier WHERE produit = $1;',[elem],(err, res) => {
            console.log("Contenu de la table après suppression" +res.rows)
             })
            }else { 
            console.log("NO DELETE")                  
            }       
            pool.end()
 


        });
              
    }catch(err){
        console.log(err);
    }finally {
        var rest= await pool.query('SELECT * FROM panier', (err, res) => {
            console.log("Contenu de la table à la fin ")
            console.log(res.rows)
            
        })
       
        
    }


}
 function exists_el(table,elem){
    for(var i=0 ;i<table.length;i++){
        if(elem=table[i].produit){
            return true;
        }
    }
    return false;
}


    /*delete_item ('Pizza neptune')
.then(resultat => {
;});*/



/****************************** Fonction qui ajoute un produit du panier*******************/
const InsertElem = async (id,elem,qt,prix) => {
    try {
        await pool.connect();  // gets connection
        await pool.query('INSERT INTO  panier values ($1,$2,$3,$4);',[id,elem,qt,prix]);
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        var re = await pool.query('SELECT * FROM panier', (err, res) => {
            console.log(res.rows)
            // closes connection
            pool.end();   
    })
};
}

./*InsertElem(5,'Pizza Thon',1,5.00).then((result) => {
    if (result) {
        console.log('product insert with success');
    }
});*/
/**************************************************************************/


    async function get_drink(productname,taille) {    
    try {
            const client =  await pool.connect();
            console.log('connected')
            results.boisson = await client.query('SELECT * FROM boisson', (err, res) => {
            console.log(res.rows)
            for(var i=0;i<res.rows.length;i++){
                if(productname===res.rows[i].nom && taille===res.rows[i].taille){
                    console.log( "prod found : ")
                    console.log(res.rows[i]);
                    return res.rows[i];
                    
            }
        }
    });

    pool.end()      
        }
      catch (error) {
        console.error(error.stack);
        return false;

      }
    }
    
/*get_drink("Evian","1.5L")
    .then(resultat => {console.log("GET boisson")
    console.log(resultat)
   
;});*/
