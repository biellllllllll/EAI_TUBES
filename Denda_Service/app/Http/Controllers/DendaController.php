<?php

namespace App\Http\Controllers;

use App\Models\Denda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class DendaController extends Controller
{
    // Gunakan environment variable untuk URL dasar (base URL) layanan
    private $pengembalianServiceBaseUrl;

    public function __construct()
    {
        // Ambil URL dasar dari .env, dengan nilai default jika tidak ditemukan
        $this->pengembalianServiceBaseUrl = env('PENGEMBALIAN_SERVICE_URL', 'http://localhost:8003');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $denda = Denda::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Data denda berhasil diambil',
                'data' => $denda
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data denda: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id_pengembalian' => 'required|integer',
                'jumlah_denda' => 'required|numeric|min:0',
                'keterangan' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Cek status pengembalian dari layanan pengembalian
            try {
                $fullUrl = $this->pengembalianServiceBaseUrl . '/api/pengembalian/' . $request->id_pengembalian;
                $pengembalianResponse = Http::get($fullUrl);

                if ($pengembalianResponse->failed()) {
                    if ($pengembalianResponse->status() == 404) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Data pengembalian dengan ID ' . $request->id_pengembalian . ' tidak ditemukan di layanan pengembalian.'
                        ], 404);
                    }
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Layanan pengembalian sedang tidak tersedia atau mengalami masalah.'
                    ], 503);
                }

            } catch (\Illuminate\Http\Client\ConnectionException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal terhubung ke layanan pengembalian.'
                ], 500);
            }

            // Buat denda tanpa status dan tanggal pembayaran
            $denda = Denda::create([
                'id_pengembalian' => $request->id_pengembalian,
                'jumlah_denda' => $request->jumlah_denda,
                'keterangan' => $request->keterangan
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Denda berhasil dibuat',
                'data' => $denda
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat denda: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $denda = Denda::find($id);

            if (!$denda) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Denda tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Data denda berhasil diambil',
                'data' => $denda
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data denda: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $denda = Denda::find($id);

            if (!$denda) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Denda tidak ditemukan'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'jumlah_denda' => 'sometimes|required|numeric|min:0',
                'keterangan' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $denda->update($request->only(['jumlah_denda', 'keterangan']));

            return response()->json([
                'status' => 'success',
                'message' => 'Denda berhasil diperbarui',
                'data' => $denda
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui denda: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $denda = Denda::find($id);

            if (!$denda) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Denda tidak ditemukan'
                ], 404);
            }

            $denda->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Denda berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus denda: ' . $e->getMessage()
            ], 500);
        }
    }

    // Metode updateStatus() telah dihapus seluruhnya.
}
