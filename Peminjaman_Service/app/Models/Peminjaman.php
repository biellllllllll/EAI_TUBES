<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    // Nama tabel (opsional jika sudah sesuai konvensi Laravel)
    protected $table = 'peminjaman';

    // Kolom yang dapat diisi secara massal sesuai dengan migrasi
    protected $fillable = [
        'id_pengunjung',
        'id_buku',
        'tanggal_pinjam',
        'tanggal_kembali', // Bisa diisi atau null
        'status',
    ];

    // Aktifkan timestamps (created_at dan updated_at)
    public $timestamps = true;

    // Jika Anda ingin mendefinisikan relasi
    // public function user()
    // {
    //     return $this->belongsTo(\App\Models\User::class, 'id_user');
    // }

    // public function buku()
    // {
    //     return $this->belongsTo(\App\Models\Buku::class, 'id_buku');
    // }
}