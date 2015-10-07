<?php
require 'vendor/autoload.php';
require_once 'model.php';

$app = new \Slim\Slim();

$app->get('/', function () {
    echo "Hello, it works!";
});

$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

$app->get('/admin/personnes', function () use ($app) {
    $users = \Users::all();
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($users));
});

$app->get('/admin/personnes/:id', function($id) use ($app) {
    $personne = \Users::find($id);
    $app->response->setBody(json_encode($personne));

});

$app->post('/admin/personnes', function() {
    $user = new \Users(array(
        'login' => $_POST['login'],
        'firstName' => $_POST['firstName'],
        'lastName' => $_POST['lastName']
    ));
    $user->save();
});

$app->get('/foo', function() {
    $users = \Users::all();

    echo $users->toJson();

    // Or create a new book
    $user = new \Users(array(
        'login' => 'rspielmann',
        'firstName' => 'Romain',
        'lastName' => 'SPIELMANN'
    ));
    $user->save();
    echo $user->toJson();
});

$app->run();
?>