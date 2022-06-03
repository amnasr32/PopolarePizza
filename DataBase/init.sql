drop table if exists pizza;
drop table if exists pizza_base;
drop table if exists pizza_ingredients;
drop table if exists menu;
drop table if exists entree;
drop table if exists boisson;
drop table if exists dessert;
drop table if exists livreur;
drop table if exists panier;
drop table if exists client;


create table pizza (
    pizza_id integer primary key,
    nom text not null,
    desc_pizza text not null,
    prix float not null
    );

create table pizza_base (
    tag text primary key,
    prix integer not null,
    size text not null,
    pate text not null
);

create table pizza_ingredients (
    categorie text not null,
    nom text primary key,
    prix float not null
);

create table menu (
    id_menu integer primary key,
    nom_menu text not null,
    desc_menu text not null,
    prix float not null
);

create table entree (
    id_entree integer primary key,
    nom text not null,
    desc_entree text not null,
    prix float not null
);

create table boisson (
    nom text not null,
    --dépend de la taille ?
    prix float not null,
    taille varchar(5) not null
);

create table dessert (
    id_dessert integer primary key,
    nom text not null,
    desc_dessert text,
    prix float not null
);   
create table panier (
    produit_id integer primary key,
    produit text not null,
    quantité integer not null,
    total float DEFAULT 0
    );
create table livreur (
    livreur_id integer primary key,
    mail text not null,
    pwd  text not null
    );
create table client (
    
    nom text not null,
    prenom text not null,
    email text not null,
    phone integer not null,
    adress text not null,
    code integer not null,
    heure text not null
    );

-- remplissage des tables

\COPY pizza FROM 'pizza.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)
\COPY pizza_base FROM 'base_pizza.csv' (DELIMITER ',',FORMAT csv,HEADER true)
\COPY boisson FROM 'boisson.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)
\COPY entree FROM 'entree.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)
\COPY pizza_ingredients FROM 'ingredients.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)

\COPY dessert FROM 'dessert.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)
\COPY menu FROM 'menu.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)
\COPY livreur FROM 'livreur.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)
\COPY panier FROM 'panier.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)
\COPY client FROM 'client.csv' WITH (DELIMITER ',',FORMAT csv,HEADER true)










