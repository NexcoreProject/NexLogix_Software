<?php
namespace App\Services;

use App\Models\Items;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class PlantillaServices
{
    // service HTTP GET
    public function getAllItems(): array
    {
        try {
            $item = Items::all();
            if ($item->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'No hay items registrados',
                    'status' => 404
                ];
            }
            return [
                'success' => true,
                'message' => 'Lista de items:',
                'data' => $item,
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
            $item = Items::where('idItem', $value)
                ->orWhere('codigo', $value)
                ->firstOrFail();
            return [
                'success' => true,
                'message' => 'Item encontrado',
                'data' => $item,
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
            $item = Items::create($data);
            return [
                'success' => true,
                'data' => $item,
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
            $item = Items::where('idItem', $value)
                ->orWhere('codigo', $value)
                ->firstOrFail();

            if (empty($data)) {
                return [
                    'success' => false,
                    'message' => 'No se proporcionaron campos válidos para actualizar',
                    'status' => 400
                ];
            }

            $item->update($data);

            return [
                'success' => true,
                'message' => 'Item actualizado correctamente',
                'data' => $item,
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
            $item = Items::where('idItem', $value)
                ->orWhere('codigo', $value)
                ->firstOrFail();

            $item->delete();

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