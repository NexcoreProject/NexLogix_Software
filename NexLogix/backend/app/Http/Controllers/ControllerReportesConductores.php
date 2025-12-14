<?php

namespace App\Http\Controllers;

use App\Services\ReportesConductoresService;
use App\UseCases\ReportesConductores\ReportesConductoresUseCase;
use Illuminate\Http\Request;

class ControllerReportesConductores extends Controller
{
    protected ReportesConductoresService $RC_service;
    protected ReportesConductoresUseCase $RC_use_case;

    public function __construct(ReportesConductoresService $RC_service, ReportesConductoresUseCase $RC_use_case)
    {
        $this->RC_service  = $RC_service;
        $this->RC_use_case = $RC_use_case;
    }

    // page-based route to avoid conflict with search-by-id route
    public function getAllRPPage(int $page, int $order = 2)
    {
        $response = $this->RC_service->getAllRP(['orderColumn' => $order, 'page' => $page]);
        return response()->json($response);
    }


    public function getRPByID(string $id)
    {
        $response = $this->RC_service->getReportById($id);
        return response()->json($response);
    }

    public function createRP(Request $request)
    {
        $response = $this->RC_use_case->handleCreateReport($request->all());
        return response()->json($response);
    }

    public function updateRP(Request $request, string $id)
    {
        $response = $this->RC_use_case->handleUpdateReport($id, $request->all());
        return response()->json($response);
    }

    public function deleteRP(string $id)
    {
        $response = $this->RC_service->deleteReport((string)$id);
        return response()->json($response);
    }
}
