<?php
namespace App\UseCases\asignacion_conductor_por_vehiculos;

use App\Models\Conductores;
use App\Models\Vehiculos;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VerificarAsignacionVehiculosConConductores
{
    public static function verificarRequisitos(array $data): array
    {
        try {
            // 1) Datos mínimos
            if (empty($data['idConductor']) && empty($data['idVehiculo'])) {
                return [
                    'success' => false,
                    'message' => 'Faltan datos requeridos: idConductor y idVehiculo',
                    'status'  => 400,
                ];
            }

            // 2) Buscar conductor y sus estados relacionados (conductor independiente de usuarios)
            $conductor = Conductores::with(['estadoConductor', 'estadoConductor_Control_Indentidades'])->find($data['idConductor']);
            if (! $conductor) {
                return [
                    'success' => false,
                    'message' => 'Conductor no encontrado',
                    'status'  => 404,
                ];
            }
            // 2a) Verificar control de identidad (estado) del conductor
            // usamos la relación idestado_Usuario_control_indentidades -> estado.idestado
            $identityState = $conductor->estadoConductor_Control_Indentidades ?? null;
            if (! $identityState || ! isset($identityState->estado) || strtoupper($identityState->estado) !== 'ACTIVO') {
                return [
                    'success' => false,
                    'message' => 'Estado de identidad del conductor no está ACTIVO',
                    'status'  => 400,
                ];
            }
            // 2b) Licencia vigente
            if (now()->gt($conductor->vigenciaLicencia)) {
                return [
                    'success' => false,
                    'message' => 'La licencia del conductor está expirada',
                    'status'  => 400,
                ];
            }

            // 3) Buscar vehículo
            $vehiculo = Vehiculos::find($data['idVehiculo']);
            if (! $vehiculo) {
                return [
                    'success' => false,
                    'message' => 'Vehículo no encontrado',
                    'status'  => 404,
                ];
            }

            // 3a) Estado disponible
            if (! in_array($vehiculo->estadoVehiculo, ['disponible','asignado','en_ruta'])) {
                return [
                    'success' => false,
                    'message' => "El vehículo está en estado “{$vehiculo->estadoVehiculo}” y no puede asignarse",
                    'status'  => 400,
                ];
            }

            // 4) Compatibilidad de licencias
            if (! static::licenciaCompatible($conductor->tipoLicencia, $vehiculo->tipoVehiculo)) {
                return [
                    'success' => false,
                    'message' => "La licencia “{$conductor->tipoLicencia}” del conductor no es compatible con el vehículo, ya que el vehiculo requiere una licencia “{$vehiculo->tipoVehiculo}”",
                    'status'  => 400,
                ];
            }

            // 5) Todo OK
            return [
                'success' => true,
                'message' => 'Requisitos cumplidos',
                'status'  => 200,
            ];
        }
        catch (ModelNotFoundException $e) {
            return [
                'success' => false,
                'message' => 'Recurso no encontrado: ' . $e->getMessage(),
                'status'  => 404,
            ];
        }
        catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error de verificación: ' . $e->getMessage(),
                'status'  => 500,
            ];
        }
    }

    /**
     * Indica si el tipo de licencia del conductor cubre
     * el nivel requerido por el tipo de vehículo.
     */
    private static function licenciaCompatible(string $lic, string $veh): bool
    {
        $niveles = [
            'A1' => 1, 'A2' => 2,
            'B1' => 3, 'B2' => 4, 'B3' => 5,
            'C1' => 6, 'C2' => 7, 'C3' => 8,
        ];
        return ($niveles[$lic] ?? 0) >= ($niveles[$veh] ?? PHP_INT_MAX);
    }
}

/*
|--------------------------------------------------------------------------
| Lógica de negocio para la asignación de conductores a vehículos
|--------------------------------------------------------------------------
|
| Relación:
| - Muchos a muchos entre conductores y vehículos mediante la tabla
|   asignacion_conductor_por_vehiculos.
|
| Reglas de negocio pendientes::
  | - Si un conductor en su estado heredado no es activo, el sistema automaticamente debe de poner el estado del conductor como no_disponible.
  | - Si un vehiculo esta asignado mas de 3 veces en una asignacion, el sistema no debe permitir asignar mas conductores.
  | - Si un conductor esta asignado mas de 3 veces en una asignacion, el sistema no debe permitir asignarlo a mas vehiculos.

*/