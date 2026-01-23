<?php
namespace App\Services;

use App\Models\ReportesConductores;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class ReportesConductoresService
{

    public function getAllRP(array $params = []): array
    {
        $perPage = 15;
        try {
            $orderColumn = (int) ($params['orderColumn'] ?? 2);
            $page = max(1, (int) ($params['page'] ?? 1));

            $columns = [
                2 => 'categoriaReportes.nombreCategoria',
            ];

            $orderBy = $columns[$orderColumn] ?? $columns[1] ?? 'categoriaReportes.nombreCategoria';

            $total = ReportesConductores::count();
            if ($total === 0) {
                return [
                    'success' => false,
                    'message' => 'No hay reportes conductores registradas',
                    'status' => 404
                ];
            }

            $itemsQuery = ReportesConductores::select('reportesConductores.*')
                ->join('categoriaReportes', 'reportesConductores.idCategoriaReportes', '=', 'categoriaReportes.idcategoria')
                ->orderBy($orderBy, 'asc');

            $items = $itemsQuery
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            // eager load relations for returned models
            $items->loadMissing(['categoriaReportes', 'conductor']);

            return [
                'success' => true,
                'message' => 'Lista de reportes conductores paginada',
                'data' => $items,
                'status' => 200
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener los reportes conductores: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    public function getReportById(string $value): array
    {
        try {
            $report = ReportesConductores::with(['categoriaReportes', 'conductor'])
                ->where('idReporte', $value)
                ->orWhere('idConductor', $value)
                ->firstOrFail();

            return [
                'success' => true,
                'message' => 'Reporte conductor encontrado',
                'data' => $report,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Reporte conductor con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener el reporte conductor: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    public function createReport(array $data): array
    {
        try {
            $report = ReportesConductores::create($data);
            return [
                'success' => true,
                'data' => $report,
                'message' => 'Reporte creado exitosamente',
                'status' => 201
            ];
        } catch (QueryException $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el reporte: ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el reporte: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    public function updateReport(string $value, array $data): array
    {
        try {
            $report = ReportesConductores::where('idReporte', $value)
                ->orWhere('idConductor', $value)
                ->firstOrFail();

            if (empty($data)) {
                return [
                    'success' => false,
                    'message' => 'No se proporcionaron campos válidos para actualizar',
                    'status' => 400
                ];
            }

            $report->update($data);

            return [
                'success' => true,
                'message' => 'Reporte actualizado correctamente',
                'data' => $report,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Reporte con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar el reporte: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    public function deleteReport(string $value): array
    {
        try {
            $report = ReportesConductores::where('idReporte', $value)
                ->orWhere('idConductor', $value)
                ->firstOrFail();

            $report->delete();

            return [
                'success' => true,
                'message' => 'Reporte eliminado correctamente',
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Reporte con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [

        'success' => false,
                        'message' => 'Error al eliminar el reporte: ' . $e->getMessage(),
                        'status' => 500
                    ];
                }
            }
}