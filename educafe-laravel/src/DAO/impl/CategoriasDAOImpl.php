<?php
namespace EduCafe\DAO\impl;

use App\Models\Categorias;
use Illuminate\Http\Request;

class CategoriasDAOImpl implements ICategoriasDAO{
    public function read(): array {

        $result = [];
        $categorias = Categorias::all()->toArray();

        foreach ($categorias as $categoria) {
            array_push($result, new CategoriasDTO(
                $categoria['_id'],
                $categoria["idCliente"],
                $categoria["pagado"],
                $categoria["articulos"],
                $categoria["fechaCreacion"]
            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $categoria = new Categorias();

        $categoria->_id = $request->_id;
        $categoria->idCliente = $request->idCliente;
        $categoria->pagado = $request->pagado;
        $categoria->articulos = $request->articulos;
        $categoria->fechaCreacion = $request->fechaCreacion;

        return $categoria->save();
    }

    public function findById($id): CategoriasDTO {

        $categoria = Categorias::all()->find($id);

        $result = new CategoriasDTO(
            $categoria['_id'],
            $categoria["idCliente"],
            $categoria["pagado"],
            $categoria["articulos"],
            $categoria["fechaCreacion"]
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Categorias::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $categoria = Categorias::where('_id',intval($id))->update([
            'idCliente' => $request->idCliente,
            'pagado' => $request->pagado,
            'articulos' => $request->articulos,
            'fechaCreacion' => $request->fechaCreacion,
            ]
        );

        return $categoria;
    }
}
