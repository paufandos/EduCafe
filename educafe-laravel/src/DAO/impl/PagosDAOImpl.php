<?php
namespace EduCafe\DAO\impl;

use App\Models\Pagos;
use EduCafe\DTO\PagosDTO;
use EduCafe\DAO\IPagosDAO;
use Illuminate\Http\Request;

class PagosDAOImpl implements IPagosDAO{
    public function read(): array {

        $result = [];
        $pagos = Pagos::get()->toArray();

        foreach ($pagos as $pago) {
            array_push($result, new PagosDTO(
                $pago['nombreTarjeta'],
                $pago["numeroTarjeta"],
                $pago["codigoSeguridad"],
                $pago["fechaCaducidad"],
                $pago["id_carrito"],
                $pago["id_usuario "],
                $pago["id"]
            ));
        }

        return $result;
    }

    public function create(Request $request): bool {

        $pago = new Pagos();

        $pago->nombreTarjeta = $request->nombreTarjeta;
        $pago->numeroTarjeta = $request->numeroTarjeta;
        $pago->codigoSeguridad = $request->codigoSeguridad;
        $pago->fechaCaducidad = $request->fechaCaducidad;
        $pago->id_carrito = $request->id_carrito;
        $pago->id_usuario = $request->id_usuario;
        $pago->id = $request->id;

        return $pago->save();
    }

    public function findById($id): PagosDTO {

        $pago = Pagos::all()->find($id);

        $result = new PagosDTO(
            $pago['nombreTarjeta'],
            $pago['numeroTarjeta'],
            $pago['codigoSeguridad'],
            $pago['fechaCaducidad'],
            $pago['id_carrito'],
            $pago['id_usuario'],
            $pago['id'],
        );

        return $result;
    }

    public function delete(int $id): bool {

        return Pagos::destroy(intval($id));
    }

    public function update(Request $request, $id): bool {

        $pago = Pagos::where('id',intval($id))->update([
            'nombreTarjeta' => $request->nombreTarjeta,
            'numeroTarjeta' => $request->numeroTarjeta,
            'codigoSeguridad' => $request->codigoSeguridad,
            'fechaCaducidad' => $request->fechaCaducidad,
            'id_carrito' => $request->numeroTarjeta,
            'id_usuario' => $request->codigoSeguridad,
            'id' => $request->id,
            ]
        );

        return $pago;
    }
}
