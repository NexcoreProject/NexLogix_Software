<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    use HasFactory;

    protected $table = 'estado'; // Corregido: $table en singular
    protected $primaryKey = 'idestado';
    public $timestamps = false;
    protected $fillable = [
        'estado',
    ];

    public function users() {
        // users.idestado -> estado.idestado
        return $this->hasMany(User::class, 'idestado', 'idestado');
    }

    public function conductores() {
        // conductores.idestado_Usuario_control_indentidades -> estado.idestado
        return $this->hasMany(Conductores::class, 'idestado_Usuario_control_indentidades', 'idestado');
    }

}
