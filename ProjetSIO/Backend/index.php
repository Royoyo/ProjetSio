<?php

/**
 * \file        index.php
 * \author      SIO-SLAM 2014-2016
 * \version     1.0
 * \date        11/19/2015
 * \brief       backend index
 *
 * \details     this file contains the index for the backend
 */

require 'vendor/autoload.php';
require_once 'model.php';
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
$app = new \Slim\Slim();

$app->run();
?>