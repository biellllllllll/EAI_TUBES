<?php

namespace App\Http\Controllers;

use App\Models\Denda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class DendaController extends Controller
{
    // Use an environment variable for the URL
    private $pengembalianServiceUrl;

    public function __construct()
    {
        $this->pengembalianServiceUrl = env('PENGEMBALIAN_SERVICE_URL', 'http://localhost:8003/api/pengembalian');
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
                'id_pengembalian' => 'required',
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

            // Check pengembalian status from pengembalian service
            try {
                $pengembalianResponse = Http::get($this->pengembalianServiceUrl . '/' . $request->id_pengembalian);

                if (!$pengembalianResponse->successful()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Data pengembalian tidak ditemukan'
                    ], 404);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal terhubung ke layanan pengembalian'
                ], 500);
            }

            $denda = Denda::create([
                'id_pengembalian' => $request->id_pengembalian,
                'jumlah_denda' => $request->jumlah_denda,
                'status_pembayaran' => 'belum_bayar',
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
                'jumlah_denda' => 'numeric|min:0',
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

    /**
     * Update the payment status of the specified denda record.
     */
    public function updateStatus(Request $request, string $id)
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
                'status_pembayaran' => 'required|string|in:belum_bayar,sudah_bayar',
                'tanggal_pembayaran' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [
                'status_pembayaran' => $request->status_pembayaran,
            ];

            // Only update tanggal_pembayaran if it's provided in the request
            if ($request->has('tanggal_pembayaran')) {
                $updateData['tanggal_pembayaran'] = $request->tanggal_pembayaran;
            } else {
                // If status is 'sudah_bayar' but no date provided, set to now()
                if ($request->status_pembayaran === 'sudah_bayar' && !$denda->tanggal_pembayaran) {
                    $updateData['tanggal_pembayaran'] = now();
                } else if ($request->status_pembayaran === 'belum_bayar') {
                    // If status is 'belum_bayar', clear the tanggal_pembayaran
                    $updateData['tanggal_pembayaran'] = null;
                }
            }

            $denda->update($updateData);

            return response()->json([
                'status' => 'success',
                'message' => 'Status pembayaran denda berhasil diperbarui',
                'data' => $denda
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui status denda: ' . $e->getMessage()
            ], 500);
        }
    }
}
