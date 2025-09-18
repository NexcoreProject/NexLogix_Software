<?php

namespace App\Http\Controllers\Rutas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Interfaces\Rutas\IRutasService;
use App\Models\Interfaces\Rutas\IRutasUseCase;

class RutasController extends Controller
{
    protected IRutasService $rutas_service;
    protected IRutasUseCase $rutas_use_case;

    public function __construct(IRutasService $rutas_service, IRutasUseCase $rutas_use_case)
    {
        $this->rutas_service  = $rutas_service;
        $this->rutas_use_case = $rutas_use_case;
    }

    public function getAllRutas()
    {
        $response = $this->rutas_service->getAllRutas();
        return response()->json($response, $response['status']);
    }

    // Ahora acepta string (id o nombreRuta)
    public function getRutaByID(string $value)
    {
        $response = $this->rutas_service->getRutaByID($value);
        return response()->json($response, $response['status']);
    }

    public function createRuta(Request $request)
    {
        $response = $this->rutas_use_case->handleCreateRuta($request->all());
        return response()->json($response, $response['status']);
    }

    // Ahora acepta string (id o nombreRuta)
    public function updateRuta(Request $request, string $value)
    {
        $response = $this->rutas_use_case->handleUpdateRuta($value, $request->all());
        return response()->json($response, $response['status']);
    }

    // Ahora acepta string (id o nombreRuta)
    public function deleteRuta(string $value)
    {
        $response = $this->rutas_service->deleteRuta($value);
        return response()->json($response, $response['status']);
    }
}
// PENDIENTE IMPLEMENTAR AUDITORIAS