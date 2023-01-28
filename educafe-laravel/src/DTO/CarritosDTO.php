<?php
namespace EduCafe\DTO;

use JsonSerializable;

class CarritosDTO implements JsonSerializable{
    function __construct(private int $id, private string $fecha, private int $estado, private int $id_usuario, private array $productos) {
        $this->id = $id;
        $this->fecha = $fecha;
        $this->estado = $estado;
        $this->id_usuario = $id_usuario;
        $this->productos = $productos;
    }

    function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'fecha' => $this->fecha,
            'estado' => $this->estado,
            'id_usuario' => $this->id_usuario,
            'productos' => $this->productos
        ];
    }

}
