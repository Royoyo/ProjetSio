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
    /// Looking for all the enabled users (where enabled = 1) and the corresponding role
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

$app->post('/admin/personnes', $authenticateWithRole('administrateur'), function() use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $personne = new Users;
        $personne->login = $data['login'];
        $personne->password = '';
        $personne->firstName = $data['firstName'];
        $personne->lastName = $data['lastName'];
        $personne->email = $data['email'];
        $personne->enabled = 1;
        $personne->connected = 0;
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

$app->put('/admin/personnes/:id', $authenticateWithRole('administrateur'), function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $personne = Users::where('id', $id)->with('roles')->firstOrFail();
        $personne->firstName = $data['firstName'];
        $personne->lastName = $data['lastName'];
        $personne->email = $data['email'];
        $personne->enabled = ($data['enabled']=="true" ? 1 : 0);
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