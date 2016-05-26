<?php

/**
 * Boot de dotEnv et chargement des variables d'environnements
 */

$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();

use Illuminate\Database\Capsule\Manager as Capsule;

/**
 * Configuration de la connexion à la base de données + Eloquent
 */
$capsule = new Capsule;

$capsule->addConnection(array(
    'driver'    => 'mysql',
    'host'      => 'localhost',
    'database'  => getenv('DATABASE_NAME'),
    'username'  => getenv('DATABASE_USER'),
    'password'  => getenv('DATABASE_PASSWORD'),
    'charset'   => 'utf8',
    'collation' => 'utf8_general_ci',
    'prefix'    => ''
));

$capsule->setAsGlobal();

$capsule->bootEloquent();
