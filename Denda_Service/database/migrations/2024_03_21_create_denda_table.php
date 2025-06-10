<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('denda', function (Blueprint $table) {
            $table->id('id_denda');
            $table->unsignedBigInteger('id_pengembalian');
            $table->decimal('jumlah_denda', 10, 2);
            $table->enum('status_pembayaran', ['belum_bayar', 'sudah_bayar'])->default('belum_bayar');
            $table->timestamp('tanggal_pembayaran')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Remove foreign key constraint since we're working with microservices
            // We'll handle the relationship through application logic
        });
    }

    public function down()
    {
        Schema::dropIfExists('denda');
    }
}; 