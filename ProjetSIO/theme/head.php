<?php
error_reporting(0); // cette fonction active ou désactive les rapports d'erreurs,
					// vu qu'on ne veut pas que le client voit les erreurs, on le met sur 0 (->false)
					// bien sûr pour les tests on le met sur 1 (-> true)
					
session_start(); // -> ouvre une session pour l'utilisateur qui se connecte.
				 // Cela va permettre de stocker des variables qui ne vont exister
				 // que pour la session en cours
				 
require_once 'fonctions/Db_connect.inc.php'; // la connexion pour la DB/ 
//require_once() permet d'être sûr qu'on ne lance la connexion vers la DB qu'une fois.
?>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<link href="style.css" rel="stylesheet" />
</head>
<body>