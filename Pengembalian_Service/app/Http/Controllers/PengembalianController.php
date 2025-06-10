<?php

namespace App\Http\Controllers;

use App\Models\Pengembalian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PengembalianController extends Controller
{
    /**
     * Menampilkan daftar semua data pengembalian.
     * Metode ini menangani: GET /api/pengembalian
     */
    public function index()
    {
        try {
            $pengembalians = Pengembalian::all();
            return response()->json([
                'message' => 'Daftar semua data pengembalian berhasil diambil.',
                'data' => $pengembalians
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil daftar pengembalian.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan satu data pengembalian spesifik.
     * Metode ini menangani: GET /api/pengembalian/{id}
     */
    public function show($id)
    {
        try {
            $pengembalian = Pengembalian::findOrFail($id);
            return response()->json([
                'message' => 'Detail data pengembalian berhasil diambil.',
                'data' => $pengembalian
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => "Data Pengembalian dengan ID {$id} tidak ditemukan."
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil detail pengembalian.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Membuat data pengembalian baru.
     * Metode ini menangani: POST /api/pengembalian
     */
    public function store(Request $request)
    {
        // ... (kode store Anda dari sebelumnya, tidak perlu diubah)
        $validator = Validator::make($request->all(), [
            'peminjaman_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 400);
        }

        $peminjamanId = $request->input('peminjaman_id');

        if (Pengembalian::where('peminjaman_id', $peminjamanId)->exists()) {
            return response()->json(['message' => 'Peminjaman ini sudah pernah dikembalikan sebelumnya.'], 422);
        }

        try {
            $peminjamanResponse = Http::get(env('URL_PEMINJAMAN_SERVICE_API') . "/api/peminjaman/{$peminjamanId}");
            if ($peminjamanResponse->failed()) {
                return response()->json(['message' => "Data Peminjaman dengan ID {$peminjamanId} tidak ditemukan."], 404);
            }
            $peminjamanData = $peminjamanResponse->json('data');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal terhubung dengan Peminjaman Service.', 'error' => $e->getMessage()], 500);
        }

        $tanggalJatuhTempo = Carbon::parse($peminjamanData['tanggal_kembali'])->startOfDay();
        $tanggalPengembalianAktual = Carbon::today();

        $status = $tanggalPengembalianAktual->gt($tanggalJatuhTempo) ? 'Terlambat' : 'Tepat Waktu';

        $pengembalian = Pengembalian::create([
            'peminjaman_id' => $peminjamanData['id'],
            'tanggal_pengembalian' => $tanggalPengembalianAktual,
            'status' => $status,
        ]);

        try {
             Http::put(env('URL_PEMINJAMAN_SERVICE_API') . "/api/peminjaman/{$peminjamanId}", [
                 'status' => $status,
             ]);
        } catch (\Exception $e) {
            // Lanjutkan proses meskipun gagal update balik
        }

        return response()->json([
            'message' => 'Data pengembalian berhasil dibuat.',
            'data' => $pengembalian
        ], 201);
    }

    /**
     * Mengedit data pengembalian yang sudah ada.
     * Metode ini menangani: PUT /api/pengembalian/{id}
     */
    public function update(Request $request, $id)
    {
        // ... (kode update Anda dari sebelumnya, tidak perlu diubah)
        $validator = Validator::make($request->all(), [
            'tanggal_pengembalian' => 'sometimes|required|date',
            'status' => 'sometimes|required|string|in:Tepat Waktu,Terlambat',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 400);
        }

        try {
            $pengembalian = Pengembalian::findOrFail($id);
            $pengembalian->update($validator->validated());

            if($request->has('status')){
                 Http::put(env('URL_PEMINJAMAN_SERVICE_API') . "/api/peminjaman/{$pengembalian->peminjaman_id}", [
                    'status' => $request->input('status'),
                 ]);
            }

            return response()->json([
                'message' => 'Data pengembalian berhasil diperbarui.',
                'data' => $pengembalian
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => "Data Pengembalian dengan ID {$id} tidak ditemukan."], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memperbarui data pengembalian.', 'error' => $e->getMessage()], 500);
        }
    }
}
