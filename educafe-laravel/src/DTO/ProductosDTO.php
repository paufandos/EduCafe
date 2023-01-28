<?php
namespace EduCafe\DTO;

use JsonSerializable;

class ProductosDTO implements JsonSerializable{
    function __construct(private int $id, private int $id_categoria, private string $nombre, private string $descripcion, private float $precio)
    {
        $this->id = $id;
        $this->id_categoria = $id_categoria;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->precio=$precio;
    }

    function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'id_categoria' => $this->id_categoria,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'precio' => $this->precio
        ];
    }

}
