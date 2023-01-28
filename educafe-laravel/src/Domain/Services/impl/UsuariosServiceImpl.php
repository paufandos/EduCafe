<?php
namespace EduCafe\Domain\Services\impl;

use EduCafe\DTO\UsuariosDTO;
use Illuminate\Http\Request;
use EduCafe\DAO\IUsuariosDAO;
use EduCafe\DAO\impl\UsuariosDAOImpl;
use EduCafe\Domain\Services\IUsuariosService;



class UsuariosServiceImpl implements IUsuariosService {

    private IUsuariosDAO $usuarios;

    function __construct() {
        $this->usuarios = new UsuariosDAOImpl();
    }

    public function all(): array{
        return $this->usuarios->read();
    }

    public function find($id): UsuariosDTO {
        return $this->usuarios->findById($id);
    }

    public function insert(Request $request): bool {
        return $this->usuarios->create($request);
    }

    public function update(Request $request, $id): bool {
        return $this->usuarios->update($request,$id);
    }

    public function delete($id): bool {
        return $this->usuarios->delete($id);
    }
}
