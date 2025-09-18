<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'usuarios'; // Nombre correcto de la tabla
    protected $primaryKey = 'idusuarios'; // Nombre correcto de la clave primaria
    public $timestamps = false; // No tiene `updated_at` ni `created_at`

    protected $fillable = [
        'documentoIdentidad',
        'nombreCompleto',
        'email',
        'numContacto',
        'direccionResidencia',
        'fechaCreacion',
        'contrasena',
        'idestado',  // FK de estado
        'idRole', // FK de roles
        'idPuestos', // FK de puestos
    ];

    protected $hidden = [
        'contrasena', 'remember_token',
    ];

    protected $cats =
    [
        'email_verified_at' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    // SE OBTIENE EL TOKEN
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    //
    public function getJWTCustomClaims()
    {
        return [
            'idRole ' => $this->idRole, // metodo hecho para que lo tome AufitLog para auditorias
        ];
    }

// FUNCIONES Y RELACIONES DE LA BASE DE DATOS

    // muchos usuarios solo pueden tener a un ESTADO
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'idestado');
    }

      // muchos usuarios solo pueden pertenecer a un ROLE
    public function roles()
    {
        return $this->belongsTo(Roles::class, 'idRole');
    }

    // muchos usuarios solo pueden tener un PUESTO
    public function puestos()
    {
        return $this->belongsTo(Puestos::class, 'idPuestos');
    }

    // un usuario puede hacer muchos reportes
    public function reportes(){
        return $this->hasMany(Reportes::class,
        'idReporte',
        'idReporte');
    }

    // un usuario puede hacer muchos envios
    public function envios()
    {
        return $this->hasMany(Envios::class, 'idusuarios', 'idusuarios');
    }

}