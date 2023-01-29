<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


class TablaCarritos extends Migration {
    public function up() {
        Schema::create('carritos', function (Blueprint $table) {
            $table->id();
            $table->string('fecha');
            $table->integer('estado');
            $table->unsignedBigInteger('id_usuario');
            //$table->json('productos');
            $table->timestamps();

            //$table->foreign('id_usuario')->references('id')->on('usuarios');
        });
    }

    public function down() {
        Schema::dropIfExists('carritos');
    }
};
