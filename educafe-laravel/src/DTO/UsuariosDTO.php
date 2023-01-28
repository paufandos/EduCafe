<?php
namespace EduCafe\DTO;

use JsonSerializable;

class UsuariosDTO implements JsonSerializable{

    function __construct(private string $nombre, private string $apellidos, private string $correo, private string $password, private int $id) {

        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->correo = $correo;
        $this->password=$password;
        $this->id = $id;
    }

    function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'apellidos' => $this->apellidos,
            'correo' => $this->correo,
            'password' => $this->password,
            'id' => $this->id
        ];
    }
}
