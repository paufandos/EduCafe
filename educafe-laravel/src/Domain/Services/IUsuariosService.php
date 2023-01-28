<?php
namespace EduCafe\Domain\Services;

use EduCafe\DTO\UsuariosDTO;
use Illuminate\Http\Request;

interface IUsuariosService {
    public function all(): array;
    public function find($id): UsuariosDTO;
    public function insert(Request $request):bool;
    public function update(Request $request, $id):bool;
    public function delete($id):bool;
}
