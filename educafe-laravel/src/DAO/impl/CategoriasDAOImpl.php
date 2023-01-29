<?php
namespace EduCafe\DAO\impl;

use App\Models\Categorias;
use Illuminate\Http\Request;
use EduCafe\DTO\CategoriasDTO;
use EduCafe\DAO\ICategoriasDAO;

class CategoriasDAOImpl implements ICategoriasDAO{
    public function read(): array {

        $result = [];
        $categorias = Categorias::get()->toArray();

        foreach ($categorias as $categoria) {
            array_push($result, new CategoriasDTO(
                $categoria['id'],
                $categoria["nombre"],
            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $categoria = new Categorias();

        $categoria->id = $request->id;
        $categoria->nombre = $request->nombre;

        return $categoria->save();
    }

    public function findById($id): CategoriasDTO {

        $categoria = Categorias::all()->find($id);

        $result = new CategoriasDTO(
            $categoria['id'],
            $categoria["nombre"]
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Categorias::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $categoria = Categorias::where('_id',intval($id))->update([
            'id' => $request->id,
            'nombre' => $request->nombre
            ]
        );

        return $categoria;
    }
}
