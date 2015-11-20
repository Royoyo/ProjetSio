<?php

/**
 * \file		index.php
 * \author		SIO-SLAM 2014-2016
 * \version		1.0
 * \date     	11/19/2015
 * \brief       backend index
 *
 * \details		this file contains the index for the backend
 */

require 'vendor/autoload.php';
require_once 'model.php';
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);    
$app = new \Slim\Slim();

/**
* Authentication
*/
function authenticate(\Slim\Route $route) {
    session_start();
    $app = \Slim\Slim::getInstance();
    if (!isset($_SESSION['id'])) {
      $app->halt(401);
    }
}

$authenticateForRole = function ($role_required){
    return function () use ( $role_required ) {
        $id = $_SESSION['id'];
        $user = Users::where('id', $id)->with('roles')->firstOrFail();
        foreach($user->roles as $role) {
            if ($role->role == $role_required) {
                return True;
            }
        }
        return False;
    };
};

$app->post('/login', function () use ($app) {
    try {
        try{
        session_start();
        }catch(Exception $e) {

        }
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $token = uniqid(rand(), true);
        if (isset($data)) {
            if (!isset($_SESSION['id'])) {
                $username = $data['name'];
                $password = $data['password'];
                $user_obj = Users::whereRaw('login = ? and password = ?', [$username, $password])->with('roles')->firstOrFail();
                $_SESSION['id'] = $user_obj->id;
                $_SESSION['token'] = $token;
            } else {
                $id = $_SESSION['id'];
                $user_obj = Users::where('id', $id)->with('roles')->firstOrFail();
            } 
            if (isset($user_obj)){
                $user_obj->connected = true;
                $user_obj->save();
                $temp_home = array();
                $role_array = array();
                foreach($user_obj->roles as $role) {
                    array_push($temp_home, $role['home']);
                    array_push($role_array, $role['role']);
                }
    
                if(in_array('administration', $temp_home)) {
                    $user_home = 'administration';
                } else if(in_array('planification', $temp_home)) {
                    $user_home = 'planification';
                } else if(in_array('enseignement', $temp_home)) {
                    $user_home = 'enseignement';
                }
    
                $user_json = array(
                    "name"=>$user_obj->login,
                    "firstName"=>$user_obj->firstName,
                    "lastName"=>$user_obj->lastName,
                    "roles"=>$role_array,
                    "token"=>$token,
                    "home"=>$user_home,
                    "id"=>$user_obj->id,
                    );
                $app->response->headers->set('Content-Type', 'application/json');
                $app->response->setBody(json_encode($user_json));
            } else {
                $app->response->headers->set('Content-Type', 'text/html');
                $app->response->setBody(false);
            }
        } else {
            $app->response->headers->set('Content-Type', 'text/html');
            $app->response->setBody(false);
        }
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'text/html');
        $app->response->setBody($e);
    }
});

$app->get('/admin/personnes', function () use ($app) {
    /// Looking for all the enabled users (where enabled = 1) and the corresponding role
    $users = Users::with('roles')->select('id', 'login', 'firstName', 'lastName', 'email', 'enabled', 'connected')->get();
    /// Sending them as JSON then it is readable by AngularJS
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/admin/personnes/:id', function($id) use ($app) {
    $personne = Users::where('id', $id)->with('roles')->select('id', 'login', 'firstName', 'lastName', 'email', 'enabled')->firstOrFail();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($personne));
});

$app->post('/admin/personnes', function() use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $user = new Users(array(
                'login' => $data['login'],
                'password' => '',
                'firstName' => $data['firstName'],
                'lastName' => $data['lastName'],
                'email' => $data['email'],
        ));
        $user->enabled = 1;
        $user->connected = 0;
        $user->save();
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

$app->put('/admin/personnes/:id', function($id) use ($app) {
    try{
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        $personne = Users::where('id', $id)->with('roles')->firstOrFail();
        $personne->firstName = $data['firstName'];
        $personne->lastName = $data['lastName'];
        $personne->email = $data['email'];
        $personne->save();
        $app->response->setBody(true);
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($e));
    }
});

$app->delete('/admin/personnes/:id', function($id) use ($app) {
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

$app->run();
?>