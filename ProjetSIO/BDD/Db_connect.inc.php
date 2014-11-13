<?php
// adresse de la base de donnée. Vu qu'ici la base de donnée SQL est 
// stockée sur le même serveur que le site, ça sera "localhost"
define("HOST", "localhost");
// nom d'utilisateur de la db, ici "root" (le nom de compte du compte admin par défaut)
define("DBUSER", "root");
// mot de passe de cet utlisateur ( jamais visible à la personne visitant le site)
define("PASS", "");
// Nom de la db utilisée
define("DB", "login");
 
// utilisation d'une fonction de php permettant de se connecter à une db
$conn = mysql_connect(HOST, DBUSER, PASS) or  die("Connexion impossible!<br />Contactez l'administrateur!");
 
$db = mysql_select_db(DB) or  die("Connexion impossible!<br />Contactez l'administrateur!");
 
?>