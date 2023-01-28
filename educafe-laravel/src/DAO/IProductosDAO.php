<?php
namespace EduCafe\DAO;

use EduCafe\DTO\ProductosDTO;
use Illuminate\Http\Request;


interface IProductosDAO {
    public function read():array;
    public function findById(int $id): ProductosDTO;
    public function update(Request $request, $id): bool;
    public function delete(int $id): bool;
    public function create(Request $request): bool;
}
