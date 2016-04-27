<?php

/**
 * \file        admin.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.0
 * \date        12/04/2015
 * \brief       administrator routes
 *
 * \details     this file contains all the routes for administrator role
 */
 
$app->get('/admin/personnes', $authenticateWithRole('administrateur'), function () use ($app) {
    /// Looking for all the users (even the one who aren't enabled) and the corresponding role
    $users = Users::with('roles')->select('id', 'login', 'firstName', 'lastName', 'email', 'enabled', 'connected')->get();
    /// Sending them as JSON then it is readable by AngularJS
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/admin/personnes/:id', $authenticateWithRole('administrateur'), function($id) use ($app) {
    $personne = Users::where('id', $id)->with('roles')->select('id', 'login', 'firstName', 'lastName', 'email', 'enabled')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($personne));
});

$app->post('/admin/personnes', $authenticateWithRole('administrateur'), function() use ($app, $mailer) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $token = uniqid(rand(), true);
        $username = strtolower($data['firstName'][0] . $data['lastName']);
        if (Users::where('login', $username)->exists()) {
            for($i=1; $i < 100; $i++){
                $username_adjusted = $username . strval($i);
                if (Users::where('login', $username_adjusted)->exists())
                    continue;
                else {
                    $username = $username_adjusted;
                    break;
                }
            }
        } 
        $personne = new Users;
        $personne->login = $username;
        $personne->password = '';
        $personne->firstName = $data['firstName'];
        $personne->lastName = $data['lastName'];
        $personne->email = $data['email'];
        $personne->token = $token;
        $personne->enabled = 0;
        $personne->connected = 0;
        $personne->save();
        
        //sync roles
        $newRoles = [];
        foreach($data['roles'] as $role){
            array_push($newRoles, $role['id']);
        }
        
        $personne->roles()->sync($newRoles);
        
        // Liste variable a utilisé dans le templat
        $list_var = array(
                'user_id' => $personne->id,
                'user_token' => $personne->token,
                'user_firstname' => $personne->firstName,
                'user_lastname' => $personne->lastName,
                'user_login' => $personne->login,
            );

        $template = file_get_contents("templates/new_user.html", FILE_TEXT);
        // ajout des valeur des variables dans le template
        foreach($list_var as $cle => $valeur) {
            $template = str_replace('{{ '.$cle.' }}', $valeur, $template);
        }     
        // ajout du header pour responsive, css ...
        $template = file_get_contents("templates/header.html", FILE_TEXT) . $template; 
        // creation du mail
        $message = Swift_Message::newInstance('Création de votre compte GPCI')
            ->setFrom(array('' => 'IFIDE SupFormation'))
            ->setTo(array($data['email'] => $data['firstName'] + '' + $data['lastName']))
            ->setBody($template, "text/html")
            ->setContentType("text/html");

        // envoie
        try {
            $results = $mailer->send($message);
        }catch(Exception $e) {
            $results = $e;
        }

        // Print the results, 1 = message sent!
        $app->response->setBody($results);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

$app->put('/admin/personnes/:id', $authenticateWithRole('administrateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $personne = Users::where('id', $id)->with('roles')->firstOrFail();
        $personne->firstName = $data['firstName'];
        $personne->lastName = $data['lastName'];
        $personne->email = $data['email'];
        $personne->enabled = $data['enabled'];
        $personne->save();
        
        //sync roles
        $newRoles = [];
        foreach($data['roles'] as $role){
            array_push($newRoles, $role['id']);
        }
        
        $personne->roles()->sync($newRoles);
        
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

$app->delete('/admin/personnes/:id', $authenticateWithRole('administrateur'), function($id) use ($app) {
    try{
        $personne = Users::where('id', $id)->with('roles')->firstOrFail();
        $personne->enabled = false;
        $personne->save();
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});
?>