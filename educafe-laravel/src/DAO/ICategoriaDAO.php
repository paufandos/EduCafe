<?php

namespace Educafe\DAO;

interface ICategoriaDAO{

    public function read(): array;

    public function create(Request $request): bool;

    public function findById($idCategoria): CategoriaDTO;

    public function update(Request $request, $idCategoria): bool;

    public function delete($idCategoria): bool;
}
