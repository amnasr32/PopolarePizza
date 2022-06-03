const express = require('express');
const { existsSync } = require('fs');
const { Server } = require('http');
const serv= express();
serv.set('view engine','ejs');
serv.use(express.urlencoded({extended: true}));
serv.use(express.static('public'));



/*****************************************Connection à la bdd *******************************************/

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
/***************************************** création des tables de données**********************************/
let results = {
    pizza : [], 
    entree : [], 
    menu: [], 
    pizza_base: [],
    pizza_ingredients : [],
    boisson : [],
    dessert : [],
    livreur: [], 
    client: [],
    panier: []

};
var total=0;
/**********************************  Fonction qui charge le contenu de la bdd *****************************/

async function upload_bdd() {    


    try {
        const client =  await pool.connect();
        console.log('connected')
        

        results.pizza = await client.query('SELECT * FROM pizza').then(res => res.rows).catch(err => console.error(err));
        results.entree = await client.query('SELECT * FROM entree').then(res => res.rows).catch(err => console.error(err));
        results.menu = await client.query('SELECT * FROM menu').then(res => res.rows).catch(err => console.error(err));
        results.pizza_base = await client.query('SELECT * FROM pizza_base').then(res => res.rows).catch(err => console.error(err));
        results.pizza_ingredients = await client.query('SELECT * FROM pizza_ingredients').then(res => res.rows).catch(err => console.error(err));
        results.boisson = await client.query('SELECT * FROM boisson').then(res => res.rows).catch(err => console.error(err));
        results.dessert = await client.query('SELECT * FROM dessert').then(res => res.rows).catch(err => console.error(err));
        results.livreur = await client.query('SELECT * FROM livreur').then(res => res.rows).catch(err => console.error(err));
        results.client = await client.query('SELECT * FROM client').then(res => res.rows).catch(err => console.error(err));
        
    }catch(err){
        console.log(err);
    }
}
upload_bdd()
    .then(resultat => {console.log("BDD chargée avec succée")
;});


/**********************************Le serveur commence l'écoute sur le port 8080*****************************/

serv.listen(8080);

/*serv.get('/panier', function(req,res){
    res.render('panier.ejs',{total:total});
});*/

console.log("Server started");



 /************************** Gestion des URI du site********************************************************/ 

// page principale ou on peut trouver tous les menus
serv.get('/welcome',function (req,res) {
    //console.log("ici");
    res.render('welcome.ejs');
    $(document).ready (function () {
        const btn = document.getElementById('evian');
        btn.addEventListener('click', function onClick(event) {
            // 👇️ Change text color globally
            console.log("click")
            document.write( "Ajouté" );
            var drink = get_drink("Evian","1.5L")
            InsertElem = async (1,drink.nom,drink,1,drink.prix)
            console.log(drink)
          
            // 👇️ Change text color for clicked element only
            // event.target.style.color = 'salmon';
          });
        });
});

//formulaire de connection des livreurs
serv.get('/livraison',function (req,res) {
    res.render('livraison.ejs',{titre:'Veuillez vous connecter'});
});

// formulaire coordonnée du client
serv.get('/order',function (req,res) {
    res.render('register_order.ejs',{titre:'Veuillez remplir vos coordonnées'});
});

// URI de la commande pour le livreur
serv.get('/commande',function (req,res) {
    res.render('commande.ejs');
});
serv.get('/panier',function (req,res) {
   getpanier(res);

});
serv.get('/promo.ejs',function (req,res) {
    res.render('error.ejs',{message:"Des promos sont à venir.."});
});
// URI vide on renvoie erreur
serv.get('/',function (req,res) {
    res.render('error.ejs',{message:"Oups!"});
});
//Pour tout autre URI  on renvoie erreur
serv.get('/:blabla',function (req,res) {
    res.render('error.ejs',{message:"404 NOT FOUND"});
});




 /**************************Gestion des Formulaires du site********************************/

// Gestion du formualire de connection du livreur
serv.post('/livraison', (req, res) => {
    console.log('livraison');
    const mail = req.body.email;
    const pwd = req.body.mdp;
    // Si les champs sont vides on renvoie la page
    if ((mail === '')|| (pwd === '')){
        res.render('livraison.ejs',{titre:'Veuillez remplir tous les champs !'});
       
    }else if (livreur_exist(results.livreur,mail,pwd)){
        // il exite bien un compte avec l'adresse mail et le mdp entrée
        res.render("commande.ejs");
    }
    else {
        console.log("données incorrects ");
        if (!mail_exist(results.livreur,mail)  ) {
            // si le mail n'existe pas donc le compte n'existe pas
            res.render('livraison.ejs',{titre:"Livreur n'existe pas"});
            }
            // sinon le mail existe et le mdp est incorrect
            else {
                res.render('livraison.ejs',{titre:'Mot de passe incorrecte! , Veuillez la saisir de nouveau'});

            }
    }
});


// Gestion du formulaire des coordonnées du client
serv.post('/order', (req, res) => {
    console.log('client');
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const phone = req.body.phone;
    const adress = req.body.adress;
    const code = req.body.code;
    const heure = req.body.heure;
    // Si tous les champs sont vides
    if ((nom === '')|| (prenom === '') || (email === '')
    || (phone === '') || (adress === '')|| (code === '') || (heure === '')){
        res.render('register_order.ejs',{titre:'Veuillez remplir tous les champs !!'});
    }else {
    // ici on appelle la fonction qui insère dans la table client
    console.log("insertion du client")
    insert_Client(nom,prenom,email,phone,adress,code,heure)
    .then(resultat => {console.log("Insert client OK");
    
    });
    }
});

/*********************************************************************************************************
 *                                                                                                       *               
 *           Fonctions auxiliaires pour la gestion des formualireq client + livreur                      *
 *                                                                                                       *
 *********************************************************************************************************/


/****************** ********vérifier l'existance du mail dans la bdd*************************************/	 

function mail_exist(livreur,element){
    exist_mail=false ;
    // parcourir les livreurs
    for(var i=0 ; i<livreur.length ; i++){
      if (element === livreur[i].mail){
          exist_mail=true 
          return exist_mail;
      }
    }
  return exist_mail;
}

/* si le mail existe :
on vérifie bien si le mdp en param est associé à ce mail sinon le compte n'existe pas */
function livreur_exist(livreur,mail,mdp){
    exist=false ;
    if (mail_exist(livreur,mail)) {
        for(var i=0 ; i<livreur.length ; i++){
            if (mail === livreur[i].mail && mdp=== livreur[i].pwd){
                 exist=true ;
                 return exist;
            }
          }
    }
    return exist;
}




/******************** Fonction qui insère un cient dans la bdd *********** */
async function insert_Client(nom,prenom,email,phone,adress,code,heure) {    

            try{
                  var client1=await pool.connect();  // gets connection
                  await pool.query('INSERT INTO  client values ($1,$2,$3,$4,$5,$6,$7);',
                  [nom,prenom,email,phone,adress,code,heure]);
              } catch (error) {
                  console.error(error.stack);
              } finally {
                  var re = await client1.query('SELECT * FROM client', (err, res) => {
                  console.log(res.rows)
                   // closes connection
                   client1.end(); 
                   client1.release();
  
              })
          };
          }

/*********************************************************************************************************
 *                                                                                                       *               
 *           Fonctions auxiliaires pour la gestion du panier (ajout/suppression)                         *
 *                                                                                                       *
 *********************************************************************************************************/


/****************** Fonction qui supprime un produit du panier *********************************/
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

/****************** Fonction qui insère un produit dans le panier *********************************/

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
/************Cette fonction  cherche le boisson selon sa taille le retourne ************************/


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
        

      }
    }

/************Cette fonction retourne le contenu de la table panier ************************/

async function getpanier(param){
    try {
        var client1= await pool.connect();  // gets connection
    } catch (error) {
        console.error(error.stack);
    } finally {
        var re =await client1.query ('SELECT SUM(total) AS total FROM panier',(err, res) => {
            total=res.rows[0].total;
            console.error(total);

        });
         re = await client1.query('SELECT * FROM panier', (err, res) => {
            results.panier=res.rows;
            param.render('panier.ejs',{panier:res.rows,total:total});

            // closes connection
            client1.end();   
    })
};
}


/*********************************************************************************************************
 *                                                                                                       *               
 *           Fonctions auxiliaires pour la gestion des événements (mouseClick..)                         *
 *                                                                                                       *
 *********************************************************************************************************/

 /****************** Gestion des click sur les boutons****************** */	 
/*$(document).ready (function () {
    // corps du programme.
    $("div.bloc").mouseenter(function(){
     console.log("Attention ,vous entrez dans la zone rouge");
     
    })
    $("div.bloc").mousedown(function(){
        $("header").append("<span style='color:#00FF00;'>up xx.</span>");
        $("p",this).append("<span style='border-style:dashed solid;'</span>");
        
        
          })
          $("div.bloc").mouseup(function(){
        
            $("footer").append("<span style='color:#f00;'>down xx.</span>");
            $("p",this).append("<span style='border: 1px  #00FF00;' </span>");
            
            
              })
    
    });     */