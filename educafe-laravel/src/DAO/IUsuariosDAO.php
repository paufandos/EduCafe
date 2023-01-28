<?php
namespace EduCafe\DAO;

use EduCafe\DTO\UsuariosDTO;
use Illuminate\Http\Request;

interface IUsuariosDAO {
    public function read():array;
    public function findById(int $id): UsuariosDTO;
    public function update(Request $request, $id): bool;
    public function delete(int $id): bool;
    public function create(Request $request): bool;
}
