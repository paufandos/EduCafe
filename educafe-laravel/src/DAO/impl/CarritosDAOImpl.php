<?php
namespace EduCafe\DAO\impl;


use App\Models\Carritos;
use EduCafe\DTO\CarritosDTO;
use EduCafe\DAO\ICarritosDAO;
use Illuminate\Http\Request;


class CarritosDAOImpl implements ICarritosDAO{

    public function read(): array {

        $result = [];

        $carritos = Carritos::get()->toArray();

        foreach ($carritos as $carrito) {
            array_push($result, new CarritosDTO(
                $carrito['id'],
                $carrito["fecha"],
                $carrito["estado"],
                $carrito["id_usuario"],
                $carrito["productos"]
            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $carrito = new Carritos();

        $carrito->id = $request->id;
        $carrito->fecha = $request->fecha;
        $carrito->estado = $request->estado;
        $carrito->id_usuario = $request->id_usuario;
        $carrito->productos = $request->productos;

        return $carrito->save();
    }

    public function findById($id): CarritosDTO {

        $carrito = Carritos::all()->find($id);

        $result = new CarritosDTO(
            $carrito['id'],
            $carrito['fecha'],
            $carrito['estado'],
            $carrito['id_usuario'],
            $carrito['productos']
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Carritos::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $carrito = Carritos::where('id',intval($id))->update([
            'id' => $request->id,
            'fecha' => $request->fecha,
            'estado' => $request->estado,
            'id_usuario' => $request->id_usuario,
            'productos' => $request->productos,
            ]
        );

        return $carrito;
    }
}
