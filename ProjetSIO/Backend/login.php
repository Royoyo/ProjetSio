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
        }
		catch(Exception $e) {
		  $app->halt(400);
        }
        $json = $app->request->getBody(); ///< getBody get the request sent by the log in form
        $data = json_decode($json, true);
        $token = uniqid(rand(), true);
        if (isset($data)) {
            if (!isset($_SESSION['id'])) { ///< if the user isn't logged in, this test will match the user's data corresponding to the user's id
				$userTemp = Users::where('login', $data['name'])->firstOrFail();
				$password = sha1($userTemp->hash . sha1($data['password']));
				$user_obj = Users::whereRaw('login = ? and password = ?', [$data['name'], $password])->with('roles')->firstOrFail();
				$_SESSION['id'] = $user_obj->id;
				$_SESSION['token'] = $token;
            } else {    ///< if the user is already logged in, the previous assignement is already done, we can skip it
                $id = $_SESSION['id'];
                $user_obj = Users::where('id', $id)->with('roles')->firstOrFail();
			}

            if ($user_obj) {
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
					"email"=>$user_obj->email,
                    "theme"=>$user_obj->theme
                    );
                $app->response->headers->set('Content-Type', 'application/json');
                $app->response->setBody(json_encode($user_json));
            }
            ///< The last lines are the errors cases
        } else {
            $app->response->setStatus(400);
			$app->response->headers->set('Content-Type', 'application/json');
			$app->response->setBody($e);
        }
    } catch(Exception $e) {
        $app->response->setStatus(400);
		$app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});

//Un logout, car si on ne détruit pas la session, on ne peut plus que se logger qu'avec le dernier compte connecté
//TO DO : Revoir le fonctionnement d'une session PHP
$app->post('/logout', function () use ($app) {
    try {
		session_start();
        $user_obj = Users::where('id', $_SESSION['id'])->update([ "connected" => 0]);
		session_destroy();
    }
	catch(Exception $e) {
		$app->response->setStatus(400);
		$app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody($e);
    }
});
