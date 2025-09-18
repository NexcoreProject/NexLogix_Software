<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoConductores extends Model
{
    protected $table = 'estado_conductores';
    protected $primaryKey = 'idEstadoConductor';
    public $timestamps = false;

    protected $fillable = [
        'c_estado',
    ];

    public function conductores()
    {
        return $this->hasMany(Conductores::class, 'idEstadoConductor', 'idEstadoConductor');
    }
}
