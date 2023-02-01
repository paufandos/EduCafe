<?php

namespace Educafe\Services;

interface ICategoriaService {

    public function all(): array;

    public function insert(Request $request): bool;

    public function find($categoria): CategoriaDTO;

    public function update(Request $request, $categoria): bool;

    public function delete($categoria): bool;

}

