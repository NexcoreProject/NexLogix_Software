<?php
namespace App\Services\Reportes;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use App\Models\Reportes;
use Exception;
class ReportesService
{
    public function getAllReportes()
    {
        try {
            // Obtiene todas las asignaciones con relaciones a vehículo y ruta
            $reporte = Reportes::with('users',  'categoriaReportes')->get();

            // Si no hay registros, devuelve un mensaje indicando que no existen datos
            if ($reporte->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'No hay reportes registradas',
                    'status' => 404
                ];
            }

            // Si existen datos, los retorna con mensaje y estado exitoso
            return [
                'success' => true,
                'message' => 'Lista de Reportes:',
                'data' => $reporte,
                'status' => 200
            ];
        } catch (Exception $e) {
            // Si ocurre un error, lo captura y devuelve mensaje de error con código 500
            return [
                'success' => false,
                'message' => 'Error al obtener Reportes ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }

    public function getAllReportesPaginated(int $page = 1): array
    {
        $perPage = 12;
        try {
            $page = max(1, (int) $page);

            $query = Reportes::with('users', 'categoriaReportes')
                ->orderBy('fechaCreacion', 'desc');

            $total = $query->count();
            if ($total === 0) {
                return [
                    'success' => false,
                    'message' => 'No hay reportes registradas',
                    'status' => 404,
                    'data' => [],
                    'meta' => [
                        'total' => 0,
                        'page' => $page,
                        'perPage' => $perPage,
                        'lastPage' => 0
                    ]
                ];
            }

            $lastPage = (int) ceil($total / $perPage);

            $items = $query->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return [
                'success' => true,
                'message' => 'Lista de Reportes paginada',
                'data' => $items,
                'meta' => [
                    'total' => $total,
                    'page' => $page,
                    'perPage' => $perPage,
                    'lastPage' => $lastPage
                ],
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

    public function getAllReportes_ById(int $id): array
    {
        try {
            // Busca una asignación específica por su ID junto con sus relaciones
            $reporte = Reportes::with('users', 'categoriaReportes')->findOrFail($id);

            // Si la encuentra, retorna la información con estado 200
            return [
                'success' => true,
                'data' => $reporte,
                'message' => 'Reportes encontrada',
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            // Si no encuentra el ID, retorna mensaje de no encontrado
            return [
                'success' => false,
                'message' => "Reporte con ID $id no encontrada",
                'status' => 404
            ];
        } catch (Exception $e) {
            // Captura cualquier otro error y lo retorna con mensaje y código 500
            return [
                'success' => false,
                'message' => 'Error al obtener la Reportes ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }
    public function create_Reportes(array $data): array
    {
        try {
            // Crea un nuevo registro en la base de datos con los datos proporcionados
            $reporte = Reportes::create($data);

            // Retorna la nueva asignación con mensaje y estado 201 (creado)
            return [
                'success' => true,
                'data' => $reporte,
                'message' => 'Reportes creada exitosamente',
                'status' => 201
            ];
        } catch (QueryException $e) {
            // Error relacionado con la consulta a la base de datos
            return [
                'success' => false,
                'message' => 'Error al crear la Reportes ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            // Cualquier otro error al intentar crear la asignación
            return [
                'success' => false,
                'message' => 'Error al crear la Reportes ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }
    public function update_Reportes(int $id, array $data)
    {
        try {
            // Busca la asignación por ID, lanza excepción si no existe
            $reporte = Reportes::findOrFail($id);

            // Si no se recibe ningún dato, retorna error de solicitud
            if (empty($data)) {
                return [
                    'success' => false,
                    'message' => 'No se proporcionaron campos válidos para actualizar',
                    'status' => 400
                ];
            }

            // Aplica los cambios al modelo y guarda
            $reporte->update($data);

            // Devuelve respuesta indicando que fue actualizado correctamente
            return [
                'success' => true,
                'message' => 'Reportes actualizada',
                'data' => $reporte,
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            // Si el ID no existe, se informa que no se encontró la asignación
            return [
                'success' => false,
                'message' => "Reporte con ID $id no encontrado",
                'status' => 404
            ];
        } catch (Exception $e) {
            // Cualquier otro error al intentar actualizar
            return [
                'success' => false,
                'message' => 'Error al actualizar la Reporte ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }
    public function delete_Reportes(int $id): array
    {
        try {
            // Busca la asignación por su ID y lanza excepción si no existe
            $reporte = Reportes::findOrFail($id);

            // Elimina el registro de la base de datos
            $reporte->delete();

            // Devuelve mensaje de éxito al eliminar
            return [
                'success' => true,
                'message' => 'Reporte eliminada correctamente',
                'status' => 200
            ];
        } catch (ModelNotFoundException $e) {
            // Si el ID no existe, retorna error 404
            return [
                'success' => false,
                'message' => "Reporte con ID $id no encontrado",
                'status' => 404
            ];
        } catch (QueryException $e) {
            // Si hay un error en la base de datos al eliminar
            return [
                'success' => false,
                'message' => 'Error al eliminar la Reporte ' . $e->getMessage(),
                'status' => 500
            ];
        } catch (Exception $e) {
            // Captura cualquier otro tipo de error al intentar eliminar
            return [
                'success' => false,
                'message' => 'Error al eliminar la Reporte ' . $e->getMessage(),
                'status' => 500
            ];
        }
    }
}
