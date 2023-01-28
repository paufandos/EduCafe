<?php
namespace EduCafe\Domain\Services;

use EduCafe\DTO\ProductosDTO;
use Illuminate\Http\Request;

interface IProductosService {
    public function all(): array;
    public function find($id): ProductosDTO;
    public function insert(Request $request):bool;
    public function update(Request $request, $id):bool;
    public function delete($id):bool;
}
