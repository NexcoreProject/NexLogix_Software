<?php
namespace App\Services;

use App\Models\CategoriaReportes;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class CategoriaReportesServices
{
    // service HTTP GET
    public function getAllItems(): array
    {
        try {
            $CR = CategoriaReportes::all();
            if ($CR->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'No hay items registrados',
                    'status' => 404
                ];
            }
            return [
                'success' => true,
                'message' => 'Lista de items:',
                'data' => $CR,
                'status' => 200
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener los items: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP GET BY ID
    public function getItemById(string $value): array
    {
        try {
            $CR = CategoriaReportes::where('idItem', $value)
                ->orWhere('codigo', $value)
                ->firstOrFail();
            return [
                'success' => true,
                'message' => 'Item encontrado',
                'data' => $CR,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Item con ID $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener el item: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP POST
    public function createItem(array $data): array
    {
        try {
            $CR = CategoriaReportes::create($data);
            return [
                'success' => true,
                'data' => $CR,
                'message' => 'Item creado exitosamente',
                'status' => 201
            ];
        } catch (QueryException $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el item: ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el item: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // PATCH SERVICE
    public function updateItem(string $value, array $data): array
    {
        try {
            $CR = CategoriaReportes::where('idItem', $value)
                ->orWhere('codigo', $value)
                ->firstOrFail();

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
                'message' => 'Item actualizado correctamente',
                'data' => $CR,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Item con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar el item: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP DELETE
    public function deleteItem(string $value): array
    {
        try {
            $CR = CategoriaReportes::where('idItem', $value)
                ->orWhere('codigo', $value)
                ->firstOrFail();

            $CR->delete();
            return [
                'success' => true,
                'message' => 'Item eliminado correctamente',
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Item con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al eliminar el item: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }
}
