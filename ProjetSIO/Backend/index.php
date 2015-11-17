<?php
require 'vendor/autoload.php';
require_once 'model.php';
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);    
$app = new \Slim\Slim();

// Authentification
function authenticate(\Slim\Route $route) {
    $app = \Slim\Slim::getInstance();
    if (!isset($_SESSION['token']) && !isset($_SESSION['id'])) {
      $app->halt(401);
    }
}
/*
    if (!isset($_SESSION['token']) || !isset($_SESSION['id'])) {
        session_start();
        $_SESSION['id'] = $user_obj->id;
        $_SESSION['token'] = $token;
        $user_obj->connected = true;
        $user_obj->save();
    }
*/

$app->post('/login', function () use ($app) {
        $json = $app->request->getBody();
        $data = json_decode($json, true);
        if(array_key_exists('id', $data)) {
            $id = $data['id'];
            $token = $data['token'];
            $user_obj = Users::where('id', $id)->with('roles')->firstOrFail();
        } else {
            $username = $data['name'];
            $password = $data['password'];
            $token = "demo";
            $user_obj = Users::whereRaw('login = ? and password = ?', [$username, $password])->with('roles')->firstOrFail();
        }
        // Créer session
        $temp_home = array();
        foreach($user_obj->roles as $role) {
            array_push($temp_home, $role['home']);
            if(in_array('administration', $temp_home)) {
                $user_home = 'administration';
                break;
            } else if(in_array('planification', $temp_home)) {
                $user_home = 'planification';
                break;
            } else if(in_array('enseignement', $temp_home)) {
                $user_home = 'enseignement';
                break;
            }
        }

        $user_json = array(
            "name"=>$user_obj->login,
            "roles"=>$user_obj->roles,
            "token"=>$token,
            "home"=>$user_home,
            "id"=>$user_obj->id,
            );
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($user_json));

});

// Verification des cookies pour l'authentification
function validateUserKey($uid, $key) {
    if ($uid == 'demo' && $key == 'demo') {
        return true;
    } else {
        return false;
    }
}

// Créer les cookies necessaire pour la session
$app->get('/demo', function () use ($app) {
    try {
        $app->setEncryptedCookie('uid', 'demo', '5 minutes');
        $app->setEncryptedCookie('key', 'demo', '5 minutes');
    } catch (Exception $e) {
        $app->response()->status(400);
        $app->response()->header('X-Status-Reason', $e->getMessage());
    }
});

$app->get('/admin/personnes', function () use ($app) {
    // On cherche les utilisateurs qui sont activé (enable à 1), ainsi que leur roles.
    $users = Users::where('enabled', 1)->with('roles')->get();
    // On les envoie au format JSON pour que AngularJS les traites.
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/admin/personnes/:id', function($id) use ($app) {
    $personne = Users::where('id', $id)->with('roles')->firstOrFail();
    $user_json = array(
        "id"=>$personne->id,
        "login"=>$personne->login,
        "roles"=>$personne->roles,
        "firstName"=>$personne->firstName,
        "lastName"=>$personne->lastName,
        "email"=>$personne->email,
        );
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($user_json));
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