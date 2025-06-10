<?php

namespace App\Services;

use App\Models\Pengembalian;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Exception;

class PengembalianService
{
    /**
     * Memproses logika pembuatan data pengembalian.
     */
    public function createPengembalian(array $data): Pengembalian
    {
        $peminjamanId = $data['peminjaman_id'];
        $peminjamanServiceUrl = env('PEMINJAMAN_SERVICE_URL', 'http://localhost:8002');

        try {
            // 1. Panggil API Layanan Peminjaman untuk dapatkan detail
            $response = Http::timeout(5)->get("{$peminjamanServiceUrl}/api/peminjaman/{$peminjamanId}");

            if ($response->failed()) {
                throw new Exception('Data peminjaman tidak ditemukan.', 404);
            }

            $detailPeminjaman = $response->json()['data'];
            $tanggalJatuhTempo = Carbon::parse($detailPeminjaman['tanggal_kembali']);
            $tanggalPengembalianInput = Carbon::parse($data['tanggal_pengembalian']);

            // 2. Tentukan status berdasarkan tanggal
            $status = $tanggalPengembalianInput->greaterThan($tanggalJatuhTempo) ? 'Terlambat' : 'Tepat Waktu';

            // 3. Simpan data pengembalian ke database
            return Pengembalian::create([
                'peminjaman_id' => $peminjamanId,
                'tanggal_pengembalian' => $tanggalPengembalianInput->toDateString(),
                'status' => $status,
            ]);
        } catch (Exception $e) {
            if ($e->getCode() === 404) {
                throw $e;
            }
            throw new Exception('Terjadi kesalahan saat memproses pengembalian buku: ' . $e->getMessage(), 500);
        }
    }
} 