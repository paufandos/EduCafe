<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CategoriasController;
use App\Http\Controllers\Api\ProductosController;
use App\Http\Controllers\Api\CarritosController;
use App\Http\Controllers\Api\UsuariosController;
use App\Http\Controllers\Api\PagosController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('categorias', CategoriasController::class);
Route::apiResource('productos', ProductosController::class);
Route::apiResource('carritos', CarritosController::class);
Route::apiResource('usuarios', UsuariosController::class);
Route::apiResource('pagos', PagosController::class);
