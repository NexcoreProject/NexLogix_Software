<?php
namespace App\Services;

use App\Models\EstadoConductores;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class EstadoConductorServices
{
    // service HTTP GET
    public function getAllEC(): array
    {
        try {
            $EC = EstadoConductores::all();
            if ($EC->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'No hay estados de conductor registrados',
                    'status' => 404
                ];
            }
            return [
                'success' => true,
                'message' => 'Lista de estados de conductor:',
                'data' => $EC,
                'status' => 200
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener los estados de conductor: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP GET BY ID
    public function getECById(string $value): array
    {
        try {
            $EC = EstadoConductores::where('idEstadoConductor', $value)
                ->orWhere('c_estado', $value)
                ->firstOrFail();
            return [
                'success' => true,
                'message' => 'Estado de conductor encontrado',
                'data' => $EC,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Estado de conductor con ID $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener el estado de conductor: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP POST
    public function createEC(array $data): array
    {
        try {
            $EC = EstadoConductores::create($data);
            return [
                'success' => true,
                'data' => $EC,
                'message' => 'Estado de conductor creado exitosamente',
                'status' => 201
            ];
        } catch (QueryException $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el estado de conductor: ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al crear el estado de conductor: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // PATCH SERVICE
    public function updateEC(string $value, array $data): array
    {
        try {
            $EC = EstadoConductores::where('idEstadoConductor', $value)
                ->orWhere('c_estado', $value)
                ->firstOrFail();

            if (empty($data)) {
                return [
                    'success' => false,
                    'message' => 'No se proporcionaron campos válidos para actualizar',
                    'status' => 400
                ];
            }

            $EC->update($data);

            return [
                'success' => true,
                'message' => 'Estado de conductor actualizado correctamente',
                'data' => $EC,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Estado de conductor con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar el estado de conductor: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    // SERVICE HTTP DELETE
    public function deleteEC(string $value): array
    {
        try {
            $EC = EstadoConductores::where('idEstadoConductor', $value)
                ->orWhere('c_estado', $value)
                ->firstOrFail();

            $EC->delete();

            return [
                'success' => true,
                'message' => 'Estado de conductor eliminado correctamente',
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Estado de conductor con valor $value no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al eliminar el estado de conductor: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }
}
