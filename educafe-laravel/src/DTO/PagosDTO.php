<?php
namespace EduCafe\DTO;

use JsonSerializable;

class PagosDTO implements JsonSerializable{

    function __construct(private string $nombreTarjeta, private string $numeroTarjeta, private int $codigoSeguridad, private string $fechaCaducidad, private int $id_carrito, private int $id_usuario, private int $id) {
        $this->nombreTarjeta = $nombreTarjeta;
        $this->numeroTarjeta = $numeroTarjeta;
        $this->codigoSeguridad = $codigoSeguridad;
        $this->fechaCaducidad = $fechaCaducidad;
        $this->id_carrito = $id_carrito;
        $this->id_usuario = $id_usuario;
        $this->id = $id;
    }

    function jsonSerialize(): mixed {
        return [
            'nombreTarjeta' => $this->nombreTarjeta,
            'numeroTarjeta' => $this->numeroTarjeta,
            'codigoSeguridad' => $this->codigoSeguridad,
            'fechaCaducidad' => $this->fechaCaducidad,
            'id_carrito' => $this->id_carrito,
            'id_usuario' => $this->id_usuario,
            'id' => $this->id
        ];
    }

}
