<?php
namespace App\Services;

use App\Models\CategoriaReportes;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class ServiceCategoriaReporte
{

    public function getAllCR(int $orderColumn = 2, int $page = 1): array
    {
        $perPage = 15;
        try {
            $orderColumn = (int) $orderColumn;
            $page = max(1, (int) $page);
            $columns = [
                2 => 'nombreCategoria',
            ];

            $orderBy = $columns[$orderColumn] ?? $columns[1];

            $total = CategoriaReportes::count();
            if ($total === 0) {
                return [
                    'success' => false,
                    'message' => 'No hay Categorias Reportes registradas',
                    'status' => 404
                ];
            }

            $items = CategoriaReportes::orderBy($orderBy, 'asc')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return [
                'success' => true,
                'message' => 'Lista de Categorias Reportes paginada',
                'data' => $items,
                'status' => 200
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener las Categorias Reportes: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP GET BY ID
    public function getCRById(string $value): array
    {
        try {
            // Only search by numeric id
            $id = (int) $value;
            $CR = CategoriaReportes::findOrFail($id);

            return [
                'success' => true,
                'message' => 'Categoria Reportes encontrada',
                'data' => $CR,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Categoria Reportes $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener la Categoria Reportes: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP POST
    public function createCR(array $data): array
    {
        try {
            $ca = CategoriaReportes::create($data);
            return [
                'success' => true,
                'data' => $ca,
                'message' => 'Categoria Reportes creada exitosamente',
                'status' => 201
            ];
        } catch (QueryException $e) {
            return [
                'success' => false,
                'message' => 'Error al crear la Categoria Reportes: ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al crear la Categoria Reportes: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // PATCH SERVICE
    public function updateCR(string $value, array $data): array
    {
        try {
            // Only search by numeric id
            $id = (int) $value;
            $CR = CategoriaReportes::findOrFail($id);

            if (empty($data)) {
                return [
                    'success' => false,
                    'message' => 'No se proporcionaron campos válidos para actualizar',
                    'status' => 400
                ];
            }
            $CR->update($data);

            return [
                'success' => true,
                'message' => 'Categoria Reportes actualizada correctamente',
                'data' => $CR,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Categoria Reportes con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar la Categoria Reportes: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP DELETE
    public function deleteCR(int $value): array
    {
        try {
            $ca = CategoriaReportes::findOrFail($value);

            $ca->delete();

            return [
                'success' => true,
                'message' => 'Categoria Reportes eliminada correctamente',
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Categoria Reportes con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al eliminar la Categoria Reportes: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }
}