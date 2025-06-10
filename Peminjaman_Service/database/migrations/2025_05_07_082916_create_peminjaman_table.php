<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            // Mengganti 'nama' dan 'judul_buku' dengan id_user dan id_buku
            $table->unsignedBigInteger('id_pengunjung'); // Kolom untuk ID user
            $table->unsignedBigInteger('id_buku'); // Kolom untuk ID buku
            $table->date('tanggal_pinjam'); // Kolom untuk tanggal peminjaman
            $table->date('tanggal_kembali')->nullable(); // Kolom untuk tanggal kembali (bisa null jika belum kembali)
            $table->string('status')->default('dipinjam'); // Kolom status (misal: dipinjam, dikembalikan, terlambat)
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjaman');
    }
};