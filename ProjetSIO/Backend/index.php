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

$app->post('/login', function () use ($app) {
    $request = $app->request();
    $json = $app->request->getBody();
    $data = json_decode($json, true);
    $username = $data['name'];
    $password = $data['password'];
    $token = "demo";
    $user_obj = Users::whereRaw('login = ? and password = ?', [$username, $password])->with('roles')->firstOrFail();

    // Créer session
    if (!isset($_SESSION['token']) || !isset($_SESSION['id'])) {
        session_start();
        $_SESSION['id'] = $user_obj->id;
        $_SESSION['token'] = $token;
        $user_obj->connected = True;
        $user_obj->save();
    }
    $user_json = array(
        "name"=>$user_obj->login,
        "roles"=>$user_obj->roles,
        "token"=>$token,
        "home"=>"administration",
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
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($personne));
});

$app->post('/admin/personnes', function() {
    $user = new Users(array(
        'login' => $_POST['login'],
        'firstName' => $_POST['firstName'],
        'lastName' => $_POST['lastName']
    ));
    $user->save();
});

$app->get('/foo', function() {
    $users = Users::all();

    echo $users->toJson();

    $user = new Users(array(
        'login' => 'rspielmann',
        'firstName' => 'Romain',
        'lastName' => 'SPIELMANN'
    ));
    $user->save();
    echo $user->toJson();
});

$app->run();
?>