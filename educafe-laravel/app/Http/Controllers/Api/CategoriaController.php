<?php

namespace App\Http\Controllers\Api;

use ICategoriaService;
use App\Models\Categoria;
use CategoriaServiceImpl;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CategoriaController extends Controller
{

    private ICategoriaService $service;

    function __construct(){
        $this->service = new CategoriaServiceImpl();
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        echo ("funciona");
        //return $this->service->all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return $this->service->insert($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Categoria  $categoria
     * @return \Illuminate\Http\Response
     */
    public function show(Categoria $categoria)
    {
        return $this->service->find($categoria);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Categoria  $categoria
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Categoria $categoria)
    {
        return $this->service->update($request, $categoria);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Categoria  $categoria
     * @return \Illuminate\Http\Response
     */
    public function destroy(Categoria $categoria)
    {
        return $this->service->delete($categoria);
    }
}
