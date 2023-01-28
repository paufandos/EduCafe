<?php
namespace EduCafe\Domain\Services\impl;

use Illuminate\Http\Request;
use EduCafe\DTO\ProductosDTO;
use EduCafe\DAO\IProductosDAO;
use EduCafe\Domain\Services\IProductosService;
use EduCafe\DAO\impl\ProductosDAOImpl;



class ProductosServiceImpl implements IProductosService {

    private IProductosDAO $productos;

    function __construct() {
        $this->productos = new ProductosDAOImpl();
    }

    public function all(): array {
        return $this->productos->read();
    }

    public function find($id): ProductosDTO {
        return $this->productos->findById($id);
    }

    public function insert(Request $request): bool {
        return $this->productos->create($request);
    }

    public function update(Request $request, $id): bool {
        return $this->productos->update($request,$id);;
    }

    public function delete($id): bool {
        return $this->productos->delete($id);
    }
}
