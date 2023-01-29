<?php
namespace EduCafe\DAO\impl;

use App\Models\Usuarios;
use EduCafe\DTO\UsuariosDTO;
use Illuminate\Http\Request;
use EduCafe\DAO\IUsuariosDAO;


class UsuariosDAOImpl implements IUsuariosDAO{
    public function read(): array {

        $result = [];
        $usuarios = Usuarios::get()->toArray();

        foreach ($usuarios as $usuario) {
            array_push($result, new UsuariosDTO(
                $usuario["id"],
                $usuario['email'],
                $usuario["password"],
            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $usuario = new Usuarios();
        $usuario->correo = $request->correo;
        $usuario->password = $request->password;

        return $usuario->save();
    }

    public function findById($id): UsuariosDTO {

        $usuario = Usuarios::all()->find($id);

        $result = new UsuariosDTO(
            $usuario["id"],
            $usuario["email"],
            $usuario["password"]
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Usuarios::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $usuario = Usuarios::where('id',intval($id))->update([
            'id' => $request->id,
            'email' => $request->email,
            'password' => $request->password
            ]
        );

        return $usuario;
    }
}
