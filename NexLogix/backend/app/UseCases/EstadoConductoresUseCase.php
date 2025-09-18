<?php

namespace App\UseCases;

use App\Services\EstadoConductorServices;
use App\Services\ServiceCategoriaReporte;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class EstadoConductoresUseCase
{
    protected EstadoConductorServices $service_ec;

    public function __construct(EstadoConductorServices $service_ec)
    {
        $this->service_ec = $service_ec;
    }

    // USECASE POST
    public function handleCreateCR(array $data): array
    {
        $validator = Validator::make($data, [
            'c_estado' => [
                'required',
                'string',
                Rule::in(['disponible', 'en_ruta', 'no_disponible', 'en_bodega']),
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

        return $this->service_ec->createEC($validator->validated());
    }

    // USECASE PATCH
    public function handleUpdateCR(int $id, array $data): array
    {
        $validator = Validator::make($data, [
            'idEstadoConductor' => [
                'sometimes',
                'integer',
                Rule::unique('estado_conductores', 'idEstadoConductor')->ignore($id, 'idEstadoConductor')
            ],
            'c_estado' => [
                'sometimes',
                'string',
                Rule::in(['disponible', 'en_ruta', 'no_disponible', 'en_bodega']),
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

        return $this->service_ec->updateEC((string) $id, $validator->validated());
    }
}
