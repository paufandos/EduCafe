<?php
namespace EduCafe\Domain\Services;

use EduCafe\DTO\CategoriasDTO;
use Illuminate\Http\Request;

interface ICategoriasService {
    public function all(): array;
    public function find($id): CategoriasDTO;
    public function insert(Request $request):bool;
    public function update(Request $request, $id):bool;
    public function delete($id):bool;
}
