<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReportesConductores extends Model
{
    use HasFactory;

    protected $table = 'reportesConductores';
    protected $primaryKey = 'idReporte';
    public $timestamps = false;

    protected $fillable = [
        'idCategoriaReportes',
        'descripcion',
        'idConductor',
    ];

    // Un reporte pertenece a una categoría de reportes
    public function categoriaReportes()
    {
        return $this->belongsTo(CategoriaReportes::class, 'idCategoriaReportes', 'idcategoria');
    }

    // Un reporte pertenece a un conductor
    public function conductor()
    {
        return $this->belongsTo(Conductores::class, 'idConductor', 'idConductor');
    }
}
