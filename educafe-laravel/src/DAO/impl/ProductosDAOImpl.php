<?php
namespace EduCafe\DAO\impl;


use App\Models\Productos;
use Illuminate\Http\Request;
use EduCafe\DTO\ProductosDTO;
use EduCafe\DAO\IProductosDAO;


class ProductosDAOImpl implements IProductosDAO{

    public function read(): array {

        $result = [];
        $productos = Productos::all()->toArray();

        foreach ($productos as $producto) {
            array_push($result, new ProductosDTO(
                $producto['_id'],
                $producto["idCliente"],
                $producto["pagado"],
                $producto["articulos"],
                $producto["fechaCreacion"]
            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $producto = new Productos();

        $producto->_id = $request->_id;
        $producto->idCliente = $request->idCliente;
        $producto->pagado = $request->pagado;
        $producto->articulos = $request->articulos;
        $producto->fechaCreacion = $request->fechaCreacion;

        return $producto->save();
    }

    public function findById($id): ProductosDTO {

        $producto = Productos::all()->find($id);

        $result = new ProductosDTO(
            $producto['_id'],
            $producto["idCliente"],
            $producto["pagado"],
            $producto["articulos"],
            $producto["fechaCreacion"]
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Productos::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $producto = Productos::where('_id',intval($id))->update([
            'idCliente' => $request->idCliente,
            'pagado' => $request->pagado,
            'articulos' => $request->articulos,
            'fechaCreacion' => $request->fechaCreacion,
            ]
        );

        return $producto;
    }
}
