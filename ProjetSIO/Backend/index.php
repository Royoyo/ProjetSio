<?php

/**
 * \file        index.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.1
 * \date        11/19/2015
 * \brief       backend index
 *
 * \details     this file contains the includes for the backend
 */

require 'vendor/autoload.php';
$app = new \Slim\Slim();
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
require_once 'model.php';
require_once 'functions.php';
require_once 'login.php';
require_once 'planificateur.php';
require_once 'admin.php';

$app->get('/roles', $authenticateWithRole('planificateur'), function () use ($app) {

    $roles = Roles::get();
    
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($roles));
});

$app->get('/matieres', $authenticateWithRole('planificateur'), function () use ($app) {

    $matieres = Matieres::get();
    
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($matieres));
});
$app->run();
?>