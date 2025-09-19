<?php
namespace App\Services\Asignacion_Conductor_Por_Vehiculos;

use App\Models\asignacion_conductor_por_vehiculos;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class ACPV_Service
{
    public function showAll_ACPV()
    {
        try {
            // eager load conductor's estado relations and vehiculo to avoid N+1 and direct usuario dependency
            $ACPV = asignacion_conductor_por_vehiculos::with([
                'conductor.estadoConductor',
                'conductor.estadoConductor_Control_Indentidades',
                'vehiculo'
            ])->get();
            if ($ACPV->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'No hay cehiculos registrados',
                    'status' => 404
                ];
            }
            return [
                'success' => true,
                'message' => 'Lista de vehiculos:',
                'data' => $ACPV,
                'status' => 200
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener el vehiculo ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }


public function showBySearching_ACPV(array $data)
{
        try {
            // eager load the conductor's estado relations and vehicle
            $ACPV = asignacion_conductor_por_vehiculos::with([
                'conductor.estadoConductor',
                'conductor.estadoConductor_Control_Indentidades',
                'vehiculo'
            ])->findOrFail($data);

            return [
                'success' => true,
                'message' => 'Asignación de conductor por vehículo encontrada',
                'data' => $ACPV,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
        return [
            'success' => false,
            'message' => 'No se encontró la asignación de conductor por vehículo',
            'status' => 404
        ];
    }
}


    // POST
    public function create_ACPV(array $data)
    {
        try {
            $asignacion = asignacion_conductor_por_vehiculos::create($data);
            return [
                'success' => true,
                'data' => $asignacion,
                'message' => 'Asignación creada exitosamente',
                'status' => 201
            ];
        } catch (QueryException $e) {
            return [
                'success' => false,
                'message' => 'Error al crear asignación: ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'status' => 500
            ];
        }
    }

    public function update_ACPV(int $id, array $data)
    {
        try {
            $asignacion = asignacion_conductor_por_vehiculos::findOrFail($id);
            $asignacion->update($data);
            return [
                'success' => true,
                'data' => $asignacion,
                'message' => 'Asignación actualizada correctamente',
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Asignación con ID $id no encontrada",
                'status' => 404
            ];
        } catch (QueryException $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar asignación: ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error inesperado: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    public function delete_ACPV(int $id)
    {
        try {
            $asignacion = asignacion_conductor_por_vehiculos::findOrFail($id);
            $asignacion->delete();
            return [
                'success' => true,
                'message' => 'Asignación eliminada correctamente',
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => "Asignación con ID $id no encontrada",
                'status' => 404
            ];
        } catch (QueryException $e) {
            return [
                'success' => false,
                'message' => 'Error al eliminar asignación: ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error inesperado: ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }
}