<?php
namespace EduCafe\DAO\impl;

use App\Models\Pagos;
use Illuminate\Http\Request;

class PagosDAOImpl implements IPagosDAO{
    public function read(): array {

        $result = [];
        $pagos = Pagos::all()->toArray();

        foreach ($pagos as $pago) {
            array_push($result, new PagosDTO(
                $pago['_id'],
                $pago["idCliente"],
                $pago["pagado"],
                $pago["articulos"],
                $pago["fechaCreacion"]
            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $pago = new Pagos();

        $pago->_id = $request->_id;
        $pago->idCliente = $request->idCliente;
        $pago->pagado = $request->pagado;
        $pago->articulos = $request->articulos;
        $pago->fechaCreacion = $request->fechaCreacion;

        return $pago->save();
    }

    public function findById($id): PagosDTO {

        $pago = Pagos::all()->find($id);

        $result = new PagosDTO(
            $pago['_id'],
            $pago["idCliente"],
            $pago["pagado"],
            $pago["articulos"],
            $pago["fechaCreacion"]
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Pagos::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $pago = Pagos::where('_id',intval($id))->update([
            'idCliente' => $request->idCliente,
            'pagado' => $request->pagado,
            'articulos' => $request->articulos,
            'fechaCreacion' => $request->fechaCreacion,
            ]
        );

        return $pago;
    }
}
