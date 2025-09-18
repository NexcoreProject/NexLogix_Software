<?php

namespace App\Http\Controllers;

use App\Services\ServiceCategoriaReporte;
use App\UseCases\UseCaseCategoriaReportes;
use Illuminate\Http\Request;


class ControllerCategoriaReportes extends Controller
{
    protected ServiceCategoriaReporte $CR_service;
    protected UseCaseCategoriaReportes $CR_use_case;

    public function __construct(ServiceCategoriaReporte $CR_service, UseCaseCategoriaReportes $CR_use_case)
    {
        $this->CR_service  = $CR_service;
        $this->CR_use_case = $CR_use_case;
    }

    // page-based route to avoid conflict with search-by-id route
    public function getAllCRPage(int $page, int $order = 2)
    {
        // allow ?raw=1 even on page route
        $response = $this->CR_service->getAllCR($order, $page);
        return response()->json($response);
    }


    public function getCRByID(string $id)
    {
        $response = $this->CR_service->getCRById($id);
        return response()->json($response);
    }

    public function createCR(Request $request)
    {
        $response = $this->CR_use_case->handleCreateCR($request->all());
        return response()->json($response);
    }

    public function updateCR(Request $request, string $id)
    {
        // pass original path identifier (could be id or nombreCategoria) to use-case
        $response = $this->CR_use_case->handleUpdateCR($id, $request->all());
        return response()->json($response);
    }

    public function deleteCR(string $id)
    {
        $response = $this->CR_service->deleteCR((int) $id);
        return response()->json($response);
    }
}