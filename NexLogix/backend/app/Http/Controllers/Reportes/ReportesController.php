<?php

namespace App\Http\Controllers\Reportes;

use App\Http\Controllers\Controller;
use App\Services\Reportes\ReportesService;
use App\UseCases\Reportes\ReportesUseCase;
use Illuminate\Http\Request;

class ReportesController extends Controller
{
    protected ReportesService $reportes_service;
    protected ReportesUseCase $reportes_UseCases;

    public function __construct(ReportesService $reportes_service, ReportesUseCase $reportes_UseCases)
    {
        $this->reportes_service = $reportes_service;
        $this->reportes_UseCases = $reportes_UseCases;
    }

    // GET ALL CONTROLLER
    public function getAllReportes()
    {
        $response = $this->reportes_service->getAllReportes();
        return response()->json($response);
    }

    // GET PAGINATED BY PAGE
    public function getAllReportesPaginated(?int $page = 1)
    {
        // allow ?raw=1 and coerce to int
        $page = max(1, (int) ($page ?? 1));

        $response = $this->reportes_service->getAllReportesPaginated($page);
        return response()->json($response, $response['status'] ?? 200);
    }

    // GET BY ID
    public function getAllReportes_ById($id)
    {
        $response = $this->reportes_service->getAllReportes_ById($id);
        return response()->json($response);
    }

    // POST CONTROLLER
    public function create_Reportes(Request $request)
    {
        $response = $this->reportes_UseCases->handleCreateReporte($request->all());
        return response()->json($response);
    }

    // PATCH CONTROLLER | EDIT or UPDATE
    public function update_Reportes( $id, Request $request )
    {
        $response = $this->reportes_UseCases->handleUpdateReporte($id, $request->all());
        return response()->json($response);
    }

    // DELETE CONTROLLER
    public function  delete_Reportes($id)
    {
        $response = $this->reportes_service->delete_Reportes($id);
        return response()->json($response);
    }
}
// PENDIENTE DEJAR REPORTES CON AUDITORIAS
