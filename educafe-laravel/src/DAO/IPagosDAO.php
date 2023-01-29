<?php
namespace EduCafe\DAO;

use EduCafe\DTO\PagosDTO;
use Illuminate\Http\Request;

interface IPagosDAO {

    public function read():array;
    public function findById(int $id): PagosDTO;
    public function update(Request $request, $id): bool;
    public function delete(int $id): bool;
    public function create(Request $request): bool;

}
