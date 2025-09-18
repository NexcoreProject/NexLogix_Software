<?php

    namespace App\UseCases\Conductores;

    use App\Services\Conductores\Conductores_service;
    use Illuminate\Support\Facades\Validator;
    use Illuminate\Validation\Rule;

    class Conductores_req_usecase
    {
        
    protected Conductores_service $conductoresService;

        public function __construct(Conductores_service $conductoresService)
        {
            $this->conductoresService = $conductoresService;
        }

        // USECASE POST
        public function handleCreateConductor(array $data): array
        {

            // 2. Validar y crear
            $validator = Validator::make($data, [
                'c_documentoIdentidad'                  => 'required|string|max:50|unique:conductores,c_documentoIdentidad',
                'c_email'                               => 'required_without:idUsuario|email|unique:conductores,c_email',
                'c_numContacto'                         => 'required|string|max:20',
                'c_direccionResidencia'                 => 'required|string|max:250',
                'licencia'                              => 'required|string|max:50|unique:conductores,licencia',
                'tipoLicencia'                          => 'required|in:A1,A2,B1,B2,B3,C1,C2,C3',
                'vigenciaLicencia'                      => 'required|date',
                'contrasena'                            => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                return [
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors'  => $validator->errors(),
                    'status'  => 422
                ];
            }

            $payload = $validator->validated();

            // Si se recibe 'contrasena' en el payload validado, aseguramos guardarla encriptada
            if (!empty($payload['contrasena'])) {
                $payload['contrasena'] = password_hash($payload['contrasena'], PASSWORD_BCRYPT);
            }
            return $this->conductoresService->createConductor($payload);
        }

        // USECASE PATCH
        public function handleUpdateSpecificSection(string $id, array $data): array
        {
            $conductor = $this->conductoresService->getConductorById($id);

            if (!$conductor['success']) {
                return [
                    'success' => false,
                    'message' => 'Conductor no encontrado',
                    'status'  => 404
                ];
            }

            $validator = Validator::make($data, [
                'c_numContacto'                         => 'sometimes|string|max:20',
                'c_direccionResidencia'                 => 'sometimes|string|max:250',
                'licencia' => [
                    'sometimes',
                    'string',
                    'max:50',
                    Rule::unique('conductores', 'licencia')->ignore($conductor['data']['idConductor'], 'idConductor'),
                ],
                'tipoLicencia'           => 'sometimes|in:A1,A2,B1,B2,B3,C1,C2,C3',
                'vigenciaLicencia'       => 'sometimes|date',
                'idEstadoConductor'      => 'sometimes|integer|exists:estado_conductores,idEstadoConductor',
                // referencia a tabla 'estado' y su PK 'idestado'
                'idestado_Usuario_control_indentidades' => 'sometimes|integer|exists:estado,idestado',
            ]);

            if ($validator->fails()) {
                return [
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors'  => $validator->errors(),
                    'status'  => 422
                ];
            }

            return $this->conductoresService->updateConductor($id, $validator->validated());
        }
}