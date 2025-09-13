<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CategoriaReportes extends Model
{
    protected $table = 'categoriaReportes';
    protected $primaryKey = 'idcategoria';
    public $timestamps = false;

    public $fillable = [
        'nombreCategoria',
    ];

    public function reportes()
    {
        return $this->hasMany(Reportes::class, 'idReporte', 'idcategoriaidReporte');
    }
}
