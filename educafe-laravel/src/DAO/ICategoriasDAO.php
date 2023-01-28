<?php
namespace EduCafe\DAO;

use Illuminate\Http\Request;
use EduCafe\DTO\CategoriasDTO;


interface ICategoriasDAO{
    public function read():array;
    public function findById(int $id): CategoriasDTO;
    public function update(Request $request, $id): bool;
    public function delete(int $id): bool;
    public function create(Request $request): bool;
}
