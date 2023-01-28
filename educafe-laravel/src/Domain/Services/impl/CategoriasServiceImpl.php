<?php
namespace EduCafe\Domain\Services\impl;

use Illuminate\Http\Request;
use EduCafe\DTO\CategoriasDTO;
use EduCafe\DAO\ICategoriasDAO;
use EduCafe\DAO\impl\CategoriasDAOImpl;
use EduCafe\Domain\Services\ICategoriasService;


class CategoriasServiceImpl implements ICategoriasService {

    private ICategoriasDAO $categorias;

    function __construct() {
        $this->categorias = new CategoriasDAOImpl();
    }

    public function all(): array{
        return $this->categorias->read();
    }

    public function find($id): CategoriasDTO {
        return $this->categorias->findById($id);
    }

    public function insert(Request $request): bool {
        return $this->categorias->create($request);
    }

    public function update(Request $request, $id): bool {
        return $this->categorias->update($request,$id);
    }

    public function delete($id): bool {
        return $this->categorias->delete($id);
    }
}
