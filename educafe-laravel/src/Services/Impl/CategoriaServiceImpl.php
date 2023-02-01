<?php

namespace Educafe\Services\Impl;
use Educafe\DAO\ICategoriaDAO;
use Educafe\DTO\CategoriaDTO;
use Illuminate\Http\Request;
use Educafe\Services\ICategoriaService;

class CategoriaServiceImpl implements ICategoriaService{

    private ICategoriaDAO $categoria;

    function __construct(){

        $this->categoria->new CategoriaDAOImpl();
    }

    public function all(): array{
        return $this->categoria->read();
    }

    public function insert(Request $request): bool{
        return $this->categoria->create($request);
    }

    public function find($categoria): CategoriaDTO{
        return $this->categoria->findById($categoria);
    }

    public function update(Request $request, $categoria): bool{
        return $this->categoria->update($request, $categoria);
    }

    public function delete($categoria): bool{
        return $this->categoria->delete($categoria);
    }
}

