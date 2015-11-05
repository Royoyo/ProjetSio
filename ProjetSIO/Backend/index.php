<?php
require 'vendor/autoload.php';
require_once 'model.php';

$app = new \Slim\Slim();

$app->get('/', function () {
    echo "Hello, it works!";
});

$app->post('/login', function () use ($app) { 
    $request = $app->request();
    $body = $request->getBody();
    $user = json_decode($body);
    $username = "rspielmann";
    $password = "020395";
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
        "userRole"=>$user_obj->roles,
        "token"=>$token,
        );
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($user_json));
});
$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

function authenticate(\Slim\Route $route) {
    $app = \Slim\Slim::getInstance();
    $uid = $app->getEncryptedCookie('uid');
    $key = $app->getEncryptedCookie('key');
    if (validateUserKey($uid, $key) === false) {
      $app->halt(401);
    }
}

function validateUserKey($uid, $key) {
  // insert your (hopefully more complex) validation routine here
  if ($uid == 'demo' && $key == 'demo') {
    return true;
  } else {
    return false;
  }
}

// generates a temporary API key using cookies
// call this first to gain access to protected API methods
$app->get('/demo', function () use ($app) {    
  try {
    $app->setEncryptedCookie('uid', 'demo', '5 minutes');
    $app->setEncryptedCookie('key', 'demo', '5 minutes');
  } catch (Exception $e) {
    $app->response()->status(400);
    $app->response()->header('X-Status-Reason', $e->getMessage());
  }

});



$app->get('/admin/personnes', 'authenticate', function () use ($app) {
    // On cherche les utilisateurs qui sont activé (enable à 1), ainsi que leur roles.
    $users = Users::where('enable', 1)->with('roles')->get();
    // On les envoie au format JSON pour que AngularJS les traites.
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/admin/personnes/:id', function($id) use ($app) {
    $personne = Users::find($id)->with('roles')->get();
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