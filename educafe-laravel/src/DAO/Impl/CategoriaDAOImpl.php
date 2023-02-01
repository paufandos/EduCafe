<?php

namespace Educafe\DAO\Impl;

use Educafe\DAO\ICategoriaDAO;
use App\Models\Categoria;
use Educafe\DTO\CategoriaDTO;
use Illuminate\Http\Request;

class CategoriaDAOImpl implements ICategoriaDAO{

    public function read(): array{

        $result = [];
        $categorias = Categoria::get()->toArray();

        foreach($categorias as $categoria){
            array_push($result, new CategoriaDTO(
                $categoria['id'],
                $categoria['nombre']
            )
            );
        }
        return $result;
    }

    public function create(Request $request): bool{

        $categoria = new Categoria();

        $categoria->id = $request->id;
        $categoria->nombre = $request->nombre;

        return $categoria->save();
    }

    public function findById($idCategoria): CategoriaDTO{

        $categoria = Categoria::all()->find(($idCategoria));

        $result = new CategoriaDTO(
            $categoria['id'],
            $categoria['nombre']
        );

        return $result;
    }

    public function update(Request $request, $idCategoria): bool{

        $categoria = Categoria::where('_id', intval($idCategoria))->update([
            'id' => $request->id,
            'nombre' => $request->nombre
        ]);

        return $categoria;
    }

    public function delete($categoria): bool{

        return Categoria::destroy(intval($idCategoria));
    }

}
