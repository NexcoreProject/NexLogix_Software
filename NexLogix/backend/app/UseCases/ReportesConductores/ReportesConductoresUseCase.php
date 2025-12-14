<?php

namespace App\UseCases\ReportesConductores;

use App\Services\ReportesConductoresService;
use Illuminate\Support\Facades\Validator;

class ReportesConductoresUseCase
{
    protected ReportesConductoresService $service;

    public function __construct(ReportesConductoresService $service)
    {
        $this->service = $service;
    }

    // CREATE (POST)
    public function handleCreateReport(array $data): array
    {
        $validator = Validator::make($data, [
            'idCategoriaReportes' => 'required|integer|exists:categoriaReportes,idcategoria',
            'descripcion' => 'required|string|max:1000',
            'idConductor' => 'required|integer|exists:conductores,idConductor',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors(),
                'status' => 422
            ];
        }

        return $this->service->createReport($validator->validated());
    }

    // UPDATE (PATCH) - partial updates allowed
    public function handleUpdateReport(string $value, array $data): array
    {
        $validator = Validator::make($data, [
            'idCategoriaReportes' => 'sometimes|integer|exists:categoriaReportes,idcategoria',
            'descripcion' => 'sometimes|string|max:1000',
            'idConductor' => 'sometimes|integer|exists:conductores,idConductor',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors(),
                'status' => 422
            ];
        }

        return $this->service->updateReport($value, $validator->validated());
    }
}