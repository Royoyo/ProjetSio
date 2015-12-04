<?php

require 'vendor/autoload.php';
require_once 'model.php';
$app = new \Slim\Slim();

/**
* Login
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

/**
* Administrateur
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

$app->put('/admin/personnes/:id', $authenticateWithRole('administrateur'), function($id) use ($app) {
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