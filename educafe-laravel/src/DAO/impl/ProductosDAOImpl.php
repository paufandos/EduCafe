<?php
namespace EduCafe\DAO\impl;


use App\Models\Productos;
use Illuminate\Http\Request;
use EduCafe\DTO\ProductosDTO;
use EduCafe\DAO\IProductosDAO;


class ProductosDAOImpl implements IProductosDAO{

    public function read(): array {

        $result = [];
        $productos = Productos::get()->toArray();

        foreach ($productos as $producto) {
            array_push($result, new ProductosDTO(
                $producto['id'],
                $producto["id_categoria"],
                $producto["nombre"],
                $producto["descripcion"],
                $producto["precio"]

            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $producto = new Productos();

        $producto->id = $request->id;
        $producto->id_categoria = $request->id_categoria;
        $producto->nombre = $request->nombre;
        $producto->descripcion = $request->descripcion;
        $producto->precio = $request->precio;

        return $producto->save();
    }

    public function findById($id): ProductosDTO {

        $producto = Productos::all()->find($id);


        $result = new ProductosDTO(
            $producto['id'],
            $producto['id_categoria'],
            $producto['nombre'],
            $producto['descripcion'],
            $producto['precio']
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Productos::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $producto = Productos::where('id',intval($id))->update([
            'id' => $request->id,
            'id_categoria' => $request->id_categoria,
            'productos' => $request->productos,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio,
            ]
        );

        return $producto;
    }
}
