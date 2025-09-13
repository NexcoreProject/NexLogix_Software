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
        return $this->hasMany( User::class, 'estado_id', 'id');
    }
    
}
