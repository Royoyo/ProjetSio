<?php

use Illuminate\Database\Capsule\Manager as Capsule;


class FullMigration {
    function run()
    {
        //Rajout des Tables
        Capsule::schema()->dropIfExists('users');
        Capsule::schema()->create('users', function($table) {
            $table->increments('id');
            $table->string('login', 50);            
            $table->string('firstName', 50);
            $table->string('lastName', 50);
            $table->string('email', 100);
            $table->boolean('enabled');
            $table->boolean('connected');
            $table->string('password', 64)->nullable();
            $table->string('hash', 128)->nullable();
            $table->string('token', 50)->nullable();
            $table->dateTime('tokenCDate')->nullable();
            $table->string('theme', 256)->nullable();
        });
        
        Capsule::schema()->dropIfExists('classes');
        Capsule::schema()->create('classes', function($table) {
            $table->increments('id');
            $table->dateTime('start');            
            $table->dateTime('end');
            $table->string('nom',25);
            $table->integer('id_Users')->unsigned();
            
            $table->foreign('id_Users')->references('id')->on('users');
        });
        
        Capsule::schema()->dropIfExists('matieres');
        Capsule::schema()->create('matieres', function($table) {
            $table->increments('id');
            $table->string('nom', 25);
            $table->string('code', 25);   
        });
        
        Capsule::schema()->dropIfExists('cours');
        Capsule::schema()->create('cours', function($table) {
            $table->increments('id');
            $table->dateTime('start');            
            $table->dateTime('end');
            $table->boolean('assignationSent');
            $table->integer('id_Matieres')->unsigned();
            $table->integer('id_Users')->unsigned()->nullable();    
            
            $table->foreign('id_Users')->references('id')->on('users');
            $table->foreign('id_Matieres')->references('id')->on('matieres');       
        });       
        
        Capsule::schema()->dropIfExists('indisponibilites');
        Capsule::schema()->create('indisponibilites', function($table) {
            $table->increments('id');
            $table->dateTime('start');            
            $table->dateTime('end');
            $table->integer('id_Users')->unsigned();    
            
            $table->foreign('id_Users')->references('id')->on('users');     
        });
        
        Capsule::schema()->dropIfExists('roles');
        Capsule::schema()->create('roles', function($table) {
            $table->increments('id');
            $table->string('role', 25);
            $table->string('home', 30);
            $table->integer('priority');  
        });
        
        Capsule::schema()->dropIfExists('cours_classes');
        Capsule::schema()->create('cours_classes', function($table) {
            $table->integer('id_Cours')->unsigned()->index();
            $table->integer('id_Classes')->unsigned()->index();
            
            $table->foreign('id_Classes')->references('id')->on('classes');
            $table->foreign('id_Cours')->references('id')->on('cours');       
        });
      
        Capsule::schema()->dropIfExists('users_matieres');
        Capsule::schema()->create('users_matieres', function($table) {
            $table->integer('id_Users')->unsigned()->index();
            $table->integer('id_Matieres')->unsigned()->index();
            
            $table->foreign('id_Matieres')->references('id')->on('matieres');
            $table->foreign('id_Users')->references('id')->on('users');       
        });
        
        Capsule::schema()->dropIfExists('users_roles');
        Capsule::schema()->create('users_roles', function($table) {
            $table->integer('id_Users')->unsigned()->index();
            $table->integer('id_Roles')->unsigned()->index();
            
            $table->foreign('id_Roles')->references('id')->on('roles');
            $table->foreign('id_Users')->references('id')->on('users');      
        });
    }
}
