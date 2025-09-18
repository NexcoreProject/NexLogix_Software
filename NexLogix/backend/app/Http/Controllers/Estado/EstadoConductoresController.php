<?php

namespace App\Http\Controllers\Estado;

use App\Http\Controllers\Controller;
use App\Services\EstadoConductorServices;
use App\UseCases\EstadoConductoresUseCase;
use Illuminate\Http\Request;

class EstadoConductoresController extends Controller
{
    protected EstadoConductorServices $service;
    protected EstadoConductoresUseCase $useCase;

    public function __construct(EstadoConductorServices $service, EstadoConductoresUseCase $useCase)
    {
        $this->service = $service;
        $this->useCase = $useCase;
    }

    // GET /gestion_estado_conductores
    public function getAllEC()
    {
        $response = $this->service->getAllEC();
        return response()->json($response);
    }

    // GET /gestion_estado_conductores/{id}
    public function getECById(string $id)
    {
        $response = $this->service->getECById($id);
        return response()->json($response);
    }

    // POST /gestion_estado_conductores
    public function createEC(Request $request)
    {
        $response = $this->useCase->handleCreateCR($request->all());
        return response()->json($response);
    }

    // PATCH /gestion_estado_conductores/{id}
    public function updateEC(Request $request, string $id)
    {
        $response = $this->useCase->handleUpdateCR((int) $id, $request->all());
        return response()->json($response);
    }

    // DELETE /gestion_estado_conductores/{id}
    public function deleteEC(string $id)
    {
        $response = $this->service->deleteEC((string) $id);
        return response()->json($response);
    }
}
