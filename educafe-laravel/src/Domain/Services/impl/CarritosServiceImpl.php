<?php
namespace EduCafe\Domain\Services\impl;

use EduCafe\DTO\CarritosDTO;
use Illuminate\Http\Request;
use EduCafe\DAO\ICarritosDAO;
use EduCafe\DAO\impl\CarritosDAOImpl;
use EduCafe\Domain\Services\ICarritosService;


class CarritosServiceImpl implements ICarritosService {

    private ICarritosDAO $carritos;

    function __construct() {
        $this->carritos = new CarritosDAOImpl();
    }

    public function all(): array{
        return $this->carritos->read();
    }

    public function find($id): CarritosDTO {
        return $this->carritos->findById($id);
    }

    public function insert(Request $request): bool {
        return $this->carritos->create($request);
    }

    public function update(Request $request, $id): bool {
        return $this->carritos->update($request,$id);
    }

    public function delete($id): bool {
        return $this->carritos->delete($id);
    }
}
