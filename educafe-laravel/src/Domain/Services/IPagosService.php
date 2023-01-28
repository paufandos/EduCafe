<?php
namespace EduCafe\Domain\Services;

use EduCafe\DTO\PagosDTO;
use Illuminate\Http\Request;

interface IPagosService {
    public function all(): array;
    public function find($id): PagosDTO;
    public function insert(Request $request):bool;
    public function update(Request $request, $id):bool;
    public function delete($id):bool;
}
