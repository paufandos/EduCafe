<?php
namespace EduCafe\DAO\impl;

use EduCafe\DAO\IUsuariosDAO;



class UsuariosDAOImpl implements IUsuariosDAO{
    public function read(): array {

        $result = [];
        $usuarios = Usuarios::all()->toArray();

        foreach ($usuarios as $usuario) {
            array_push($result, new UsuariosDTO(
                $usuario['_id'],
                $usuario["idCliente"],
                $usuario["pagado"],
                $usuario["articulos"],
                $usuario["fechaCreacion"]
            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $usuario = new Usuarios();

        $usuario->_id = $request->_id;
        $usuario->idCliente = $request->idCliente;
        $usuario->pagado = $request->pagado;
        $usuario->articulos = $request->articulos;
        $usuario->fechaCreacion = $request->fechaCreacion;

        return $usuario->save();
    }

    public function findById($id): UsuariosDTO {

        $usuario = Usuarios::all()->find($id);

        $result = new UsuariosDTO(
            $usuario['_id'],
            $usuario["idCliente"],
            $usuario["pagado"],
            $usuario["articulos"],
            $usuario["fechaCreacion"]
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Usuarios::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $usuario = Usuarios::where('_id',intval($id))->update([
            'idCliente' => $request->idCliente,
            'pagado' => $request->pagado,
            'articulos' => $request->articulos,
            'fechaCreacion' => $request->fechaCreacion,
            ]
        );

        return $usuario;
    }
}
