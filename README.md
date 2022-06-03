# Popolare_Pizza : un site de livraison de pizzas à domicile.
##  Membres
NASR Amira 


## Lancer le site : nodejs main.js

## Fonctionaliés implémentés :
1- Affichage du contenu tu table panier

2- Connection des livreur

3- Enregistrement du client

4- Affichage de l'ensemle des produits sur la page d'accueil

5- Les fonctions de mise à jour du panier : (ajout produit/suppression produit)

6-Création de la bdd , ses tables ainsi que leur remplissage 
## Fonctionaliés non implémentés :
1-Les boutons d'ajout/suppresion des produit sont non fonctionnel 

2-Pizza coposable  & affichage du contenu d'une commande une le livreur connecté

## Répartition des tâches :
**Amira** : 

        Création de la BDD :

            Création de l'utilisateur 
            Implémantation/Correction/Remplissage init.sql 
            Remplissage desfichiers csv et chargement des tables 

        Implémentation de tout le code (Html,Css,Javascipt) ainsi que les fonctionnalités qui marchent : 

            main.js 
            commande.ejs 
            error.ejs 
            livraison.ejs 
            panier.ejs 
            principal.ejs 
            register_order.ejs 
            welcome.ejs 




## Lancement de la BDD depuis une autre machie
**Création de user ainsi que de son mot de passe :**  
                CREATE USER amnasr with ENCRYPTED PASSWORD 'FacoupMy' ;

**Création de la Base de donnée :**
                CREATE DATABASE popolare ;

**Se connecter à la BDD :**
                           Se placer dans DataBase puis :

                              mysql -d popolare -U amnasr

                       Exécution du scipt: 

                              \i init.sql


