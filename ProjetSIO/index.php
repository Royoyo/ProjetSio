<?php
//je déclare une variable qui va garder l'adresse du dossier "/projetSIO" ( ici __ROOT__ )
// C'est utile pour faire ces adresses sur n'importe quelle autre serveur
// L'alternative serait quelque chose du genre : 
// include 'machinsite.com/SIO/projet/theme/header.php';
define('__ROOT__',dirname(dirname(__FILE__)));

require __ROOT__ . '/theme/head.php';
include __ROOT__ . '/theme/header.php';
include 'content.php';
include __ROOT__ . '/theme/footer.php';
require __ROOT__ . '/theme/footerfinal.php';
?>