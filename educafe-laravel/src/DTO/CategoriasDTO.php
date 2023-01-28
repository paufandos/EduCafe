<?php
namespace EduCafe\DTO;

use JsonSerializable;

class CategoriasDTO implements JsonSerializable{
    function __construct(private int $id, private string $nombre) {

        $this->id = $id;
        $this->nombre = $nombre;
    }

    function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre
        ];
    }
}
