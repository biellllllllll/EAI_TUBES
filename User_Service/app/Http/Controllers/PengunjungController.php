<?php

namespace App\Http\Controllers;

use App\Models\Pengunjung;
use Illuminate\Http\Request;

class PengunjungController extends Controller
{
    /**
     * Menampilkan semua data pengunjung.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $pengunjung = Pengunjung::all();
        return response()->json($pengunjung, 200);
    }

    /**
     * Menyimpan data pengunjung baru.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:pengunjung,email',
            'telepon' => 'nullable|string|max:20',
        ]);

        $pengunjung = Pengunjung::create($validated);
        return response()->json([
            'message' => 'Pengunjung berhasil ditambahkan',
            'data' => $pengunjung
        ], 201);
    }

    /**
     * Menampilkan detail pengunjung berdasarkan ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $pengunjung = Pengunjung::find($id);

        if (!$pengunjung) {
            return response()->json(['message' => 'Pengunjung tidak ditemukan'], 404);
        }

        return response()->json($pengunjung, 200);
    }

    /**
     * Memperbarui data pengunjung berdasarkan ID.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $pengunjung = Pengunjung::find($id);

        if (!$pengunjung) {
            return response()->json(['message' => 'Pengunjung tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:pengunjung,email,' . $id,
            'telepon' => 'nullable|string|max:20',
        ]);

        $pengunjung->update($validated);
        return response()->json([
            'message' => 'Pengunjung berhasil diperbarui',
            'data' => $pengunjung
        ], 200);
    }

    /**
     * Menghapus pengunjung berdasarkan ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $pengunjung = Pengunjung::find($id);

        if (!$pengunjung) {
            return response()->json(['message' => 'Pengunjung tidak ditemukan'], 404);
        }

        $pengunjung->delete();
        return response()->json(['message' => 'Pengunjung berhasil dihapus'], 200);
    }
}
