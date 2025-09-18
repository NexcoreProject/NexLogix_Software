<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conductores extends Model
{
    use HasFactory;

    protected $table = 'conductores';
    protected $primaryKey = 'idConductor';
    public $timestamps = false;

    // Ajustado para reflejar la estructura actual de la tabla `conductores`
    protected $fillable = [
        'c_documentoIdentidad',
        'c_email',
        'c_numContacto',
        'c_direccionResidencia',
        'licencia',
        'tipoLicencia',
        'vigenciaLicencia',
        'contrasena',
        'idEstadoConductor',
        'idestado_Usuario_control_indentidades',
    ];

    // Oculta campos sensibles al serializar (por ejemplo, al convertir a JSON)
    protected $hidden = [
        'contrasena',
    ];

    // Un conductor pertenece a un usuario


    // Un conductor puede tener muchas asignaciones de vehículos
    public function asignacionesVehiculos()
    {
        return $this->hasMany(asignacion_conductor_por_vehiculos::class, 'idConductor', 'idConductor');
    }

    // Relación a la tabla de estados de conductor
    public function estadoConductor()
    {
        return $this->belongsTo(EstadoConductores::class, 'idEstadoConductor', 'idEstadoConductor');
    }

    public function estadoConductor_Control_Indentidades()
    {
        // local FK: idestado_Usuario_control_indentidades -> Estado PK: idestado
        return $this->belongsTo(Estado::class, 'idestado_Usuario_control_indentidades', 'idestado');
    }

}
