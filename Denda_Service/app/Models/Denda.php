<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Denda extends Model
{
    use HasFactory;

    protected $table = 'denda';
    protected $primaryKey = 'id_denda';
    public $timestamps = true;

    protected $fillable = [
        'id_pengembalian',
        'jumlah_denda',
        'status_pembayaran',
        'tanggal_pembayaran',
        'keterangan'
    ];

    protected $casts = [
        'tanggal_pembayaran' => 'datetime',
        'jumlah_denda' => 'decimal:2'
    ];

    // We'll handle the relationship through the controller
    // The relationship is now managed through API calls to the pengembalian service
} 