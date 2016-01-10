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
            $user_obj->connected = true;
            $user_obj->save();  ///< to keep the online status in the database
            $role_priority = 0;
            $role_array = [];
            foreach($user_obj->roles as $role) {
                array_push($role_array, $role['role']);
                if ($role['priority'] < $role_priority || $role_priority == 0) {
                    $role_priority = $role['priority'];
                    $user_home = $role['home'];
                }
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
    } catch(Exception $e) {
        $app->response->headers->set('Content-Type', 'text/html');
        $app->response->setBody($e);
    }
});
