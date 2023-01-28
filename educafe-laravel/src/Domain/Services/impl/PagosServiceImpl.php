<?php
namespace EduCafe\Domain\Services\impl;

use EduCafe\DTO\PagosDTO;
use Illuminate\Http\Request;
use EduCafe\DAO\impl\PagosDAOImpl;
use EduCafe\Domain\Services\IPagosService;
use EduCafe\DAO\IPagosDAO;

class PagosServiceImpl implements IPagosService {

    private IPagosDAO $pagos;

    function __construct() {
        $this->pagos = new PagosDAOImpl();
    }

    public function all(): array{
        return $this->pagos->read();
    }

    public function find($id): PagosDTO {
        return $this->pagos->findById($id);
    }

    public function insert(Request $request): bool {
        return $this->pagos->create($request);
    }

    public function update(Request $request, $id): bool {
        return $this->pagos->update($request,$id);
    }

    public function delete($id): bool {
        return $this->pagos->delete($id);
    }
}
