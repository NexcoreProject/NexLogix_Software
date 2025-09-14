<?php

namespace App\UseCases\Items;

use App\Services\PlantillaServices;
use Illuminate\Support\Facades\Validator;

class PlantillaUseCase
{
    protected PlantillaServices $plantillaServices;

    public function __construct(PlantillaServices $plantillaServices)
    {
        $this->plantillaServices = $plantillaServices;
    }

    // USECASE POST
    public function handleCreateItem(array $data): array
    {
        $validator = Validator::make($data, [
            'nombreItem' => 'required|string|max:100',
            'descripcionItem' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors(),
                'status' => 422
            ];
        }

        return $this->plantillaServices->createItem($validator->validated());
    }

    // USECASE PUT
    public function handleUpdateItem(int $id, array $data): array
    {
        $validator = Validator::make($data, [
            'nombreItem' => 'required|string|max:100',
            'descripcionItem' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors(),
                'status' => 422
            ];
        }

        return $this->plantillaServices->updateItem($id, $validator->validated());
    }

    // USECASE PATCH
    public function handleUpdateSpecificSection(int $id, array $data): array
    {
        $validator = Validator::make($data, [
            'nombreItem' => 'sometimes|string|max:100',
            'descripcionItem' => 'sometimes|string|max:255'
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors(),
                'status' => 422
            ];
        }

        return $this->plantillaServices->updateItem($id, $validator->validated());
    }
}
