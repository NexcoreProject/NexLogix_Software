<?php

namespace App\UseCases;

use App\Services\ServiceCategoriaReporte;
use App\Models\CategoriaReportes;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UseCaseCategoriaReportes
{
    protected ServiceCategoriaReporte $CR;

    public function __construct(ServiceCategoriaReporte $CR)
    {
        $this->CR = $CR;
    }

    // USECASE POST
    public function handleCreateCR(array $data): array
    {
        $validator = Validator::make($data, [
            'nombreCategoria' => 'required|string|max:100|unique:categoriaReportes,nombreCategoria',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors(),
                'status' => 422
            ];
        }

        return $this->CR->createCR($validator->validated());
    }

    // USECASE PATCH
    public function handleUpdateCR(int $id, array $data): array
    {
        $validator = Validator::make($data, [
            'nombreCategoria' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('categoriaReportes', 'nombreCategoria')->ignore($id, 'idcategoria'),
            ],
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors(),
                'status' => 422
            ];
        }

        return $this->CR->updateCR((string) $id, $validator->validated());
    }
}
