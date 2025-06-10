<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Buku extends Model
{
    // Nama tabel yang terkait dengan model ini
    protected $table = 'buku';

    // Kolom yang boleh diisi secara massal (mass assignment)
    protected $fillable = [
        'judul_buku',
        'penulis_buku',
        'penerbit_buku',
        'tahun_terbit_buku',
    ];
}
