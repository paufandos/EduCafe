<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TablaPagos extends Migration {
    public function up() {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->string('nombreTarjeta');
            $table->string('numeroTarjeta');
            $table->integer('codigoSeguridad');
            $table->string('fechaCaducidad');
            $table->unsignedBigInteger('id_carrito');
            $table->unsignedBigInteger('id_usuario');
            $table->timestamps();

            //$table->foreign('id_carrito')->references('id')->on('carritos');
            //$table->foreign('id_usuario')->references('id')->on('usuarios');
        });
    }

    public function down() {
        Schema::dropIfExists('pagos');
    }
};


