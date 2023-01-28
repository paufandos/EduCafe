<?php
namespace EduCafe\DAO\impl;


use App\Models\Carritos;
use EduCafe\DTO\CarritosDTO;
use EduCafe\DAO\ICarritosDAO;
use Illuminate\Http\Request;


class CarritosDAOImpl implements ICarritosDAO{

    public function read(): array {

        $result = [];

        $carritos = Carritos::all()->toArray();

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

        $carrito = Carritos::where('_id',intval($id))->update([
            'idCliente' => $request->idCliente,
            'pagado' => $request->pagado,
            'articulos' => $request->articulos,
            'fechaCreacion' => $request->fechaCreacion,
            ]
        );

        return $carrito;
    }
}
