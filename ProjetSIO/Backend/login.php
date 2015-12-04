<?php

/**
* \file        login.php
* \author      SIO-SLAM 2014-2016
* \version     1.0
* \date        12/04/2015
* \brief       login
*
* \details     this file contains the login treatment
*/

$app->post('/login', function () use ($app) {
    try {
        try{    ///< If the session is already on, then session_start will return an error signal
            session_start();
        } catch(Exception $e) {

        }
        $json = $app->request->getBody(); ///< getBody get the request sent by the log in form
        $data = json_decode($json, true);
        $token = uniqid(rand(), true);
        if (isset($data)) {
            if (!isset($_SESSION['id'])) { ///< if the user isn't logged in, this test will match the user's data corresponding to the user's id 
                $username = $data['name'];
                $password = $data['password'];
                $user_obj = Users::whereRaw('login = ? and password = ?', [$username, $password])->with('roles')->firstOrFail();
                $_SESSION['id'] = $user_obj->id;
                $_SESSION['token'] = $token;
            } else {    ///< if the user is already logged in, the previous assignement is already done, we can skip it
                $id = $_SESSION['id'];
                $user_obj = Users::where('id', $id)->with('roles')->firstOrFail();
            } 
            if (isset($user_obj)){          /* à tester sans le if */
                $user_obj->connected = true;
                $user_obj->save();  ///< to keep the online status in the database
                $temp_home = array();
                $role_array = array();
                foreach($user_obj->roles as $role) {
                    array_push($temp_home, $role['home']);
                    array_push($role_array, $role['role']);
                }
                ///< The 7 next line match the user with their roles to their role homepage
                if(in_array('administration', $temp_home)) {
                    $user_home = 'administration';
                } else if(in_array('planification', $temp_home)) {
                    $user_home = 'planification';
                } else if(in_array('enseignement', $temp_home)) {
                    $user_home = 'enseignement';
                }
    
                $user_json = array( ///< stock all the user's information's in the user_json variable
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
                ///< The last lines are the errors cases
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
