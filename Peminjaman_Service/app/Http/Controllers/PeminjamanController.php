<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class PeminjamanController extends Controller
{
    /**
     * Menampilkan daftar semua peminjaman.
     */
    public function index()
    {
        try {
            $peminjaman = Peminjaman::all();
            return response()->json([
                'message' => 'Daftar Peminjaman',
                'data' => $peminjaman
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil daftar peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menyimpan data peminjaman baru.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'id_pengunjung' => 'required|integer',
            'id_buku' => 'required|integer',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali' => 'required|date|after_or_equal:tanggal_pinjam',
            // 'status' will be defaulted to 'dipinjam'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 400);
        }

        $validated = $validator->validated();
        $validated['status'] = 'dipinjam'; // Set status to 'dipinjam' by default

        // Validasi id_pengunjung dari User Service
        try {
            $userResponse = Http::get(env('URL_USER_SERVICE_API') . "/api/pengunjung/{$validated['id_pengunjung']}");
            if ($userResponse->failed() || !$userResponse->json()) {
                return response()->json([
                    'message' => 'User Pengunjung tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal terhubung dengan User Service',
                'error' => $e->getMessage()
            ], 500);
        }

        // Validasi id_buku dari Buku Service
        try {
            $bukuResponse = Http::get(env('URL_BUKU_SERVICE_API') . "/api/buku/{$validated['id_buku']}");
            if ($bukuResponse->failed() || !$bukuResponse->json()) {
                return response()->json([
                    'message' => 'Buku tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal terhubung dengan Buku Service',
                'error' => $e->getMessage()
            ], 500);
        }

        // Simpan data peminjaman
        try {
            $peminjaman = Peminjaman::create($validated);
            return response()->json([
                'message' => 'Data Peminjaman berhasil ditambahkan',
                'data' => $peminjaman
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan data peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan detail peminjaman tertentu.
     */
    public function show($id)
    {
        try {
            $peminjaman = Peminjaman::findOrFail($id);
            return response()->json([
                'message' => 'Detail Peminjaman',
                'data' => $peminjaman
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data Peminjaman tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Mengupdate data peminjaman tertentu.
     */
    public function update(Request $request, $id)
    {
        try {
            $peminjaman = Peminjaman::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data Peminjaman tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }

        // Validasi input
        $validator = Validator::make($request->all(), [
            'id_pengunjung' => 'sometimes|required|integer',
            'id_buku' => 'sometimes|required|integer',
            'tanggal_pinjam' => 'sometimes|required|date',
            'tanggal_kembali' => 'nullable|date|after_or_equal:tanggal_pinjam',
            'status' => 'sometimes|required|string|in:dipinjam,dikembalikan,terlambat',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 400);
        }

        $validated = $validator->validated();

        // Validasi id_pengunjung dari User Service (jika diupdate)
        if ($request->has('id_pengunjung')) {
            try {
                $userResponse = Http::get(env('URL_USER_SERVICE_API') . "/api/v1/pengunjung/{$validated['id_pengunjung']}");
                if ($userResponse->failed() || !$userResponse->json()) {
                    return response()->json([
                        'message' => "User dengan ID {$validated['id_pengunjung']} tidak ditemukan"
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Gagal terhubung dengan User Service',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        // Validasi id_buku dari Buku Service (jika diupdate)
        if ($request->has('id_buku')) {
            try {
                $bukuResponse = Http::get(env('URL_BUKU_SERVICE_API') . "/api/v1/buku/{$validated['id_buku']}");
                if ($bukuResponse->failed() || !$bukuResponse->json()) {
                    return response()->json([
                        'message' => "Buku dengan ID {$validated['id_buku']} tidak ditemukan"
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Gagal terhubung dengan Buku Service',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        // Update data peminjaman
        try {
            $peminjaman->update($validated);
            return response()->json([
                'message' => 'Data Peminjaman berhasil diperbarui',
                'data' => $peminjaman
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui data peminjaman',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus data peminjaman tertentu.
     */
    public function destroy($id)
    {
        try {
            $peminjaman = Peminjaman::findOrFail($id);
            $peminjaman->delete();
            return response()->json([
                'message' => 'Data Peminjaman berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data Peminjaman tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
