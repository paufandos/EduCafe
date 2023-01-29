<?php
namespace EduCafe\DTO;

use JsonSerializable;

class UsuariosDTO implements JsonSerializable{

    function __construct(private int $id, private string $correo, private string $password) {
        $this->id = $id;
        $this->correo = $correo;
        $this->password=$password;

    }

    function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'correo' => $this->correo,
            'password' => $this->password
        ];
    }
}
