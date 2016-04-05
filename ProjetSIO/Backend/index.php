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
require_once 'enseignant.php';
require_once 'admin.php';
require_once 'profil.php';

$app->get('/roles', $authenticateWithRole('administrateur'), function () use ($app) {

    $roles = Roles::get();
    
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($roles));
});

$app->get('/matieres', $authenticateWithRole('planificateur'), function () use ($app) {

    $matieres = Matieres::get();
    
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($matieres));
});

$app->get('/activation/:id/token/:token', function($id, $token) use ($app) {
    $user = Users::where('id', $id)->firstOrFail();
    if ($user->token == $token){
        $user->enabled = 1;
        $user->save();
        $app->response->setBody(true);
    }
    else{
        $app->response->setBody(false);
    }
});

$app->post('/set_firstpassword', function() use ($app) {
    $json = $app->request->getBody();
    $data = json_decode($json, true);
    $user = Users::where('id', $data['id'])->firstOrFail();
    $hash = uniqid(rand(), true);
    if ($data['password'] == $data['password_confirm']) {
        $user->hash = $hash;
        $user->password = sha1($hash . sha1($data['password']));
        $user->save();
        $app->response->setBody(true);
    }
    else{
        $app->response->setBody(false);
    }
});

$app->run();
?>