<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use Illuminate\Http\Request;

class BukuController extends Controller
{
    /**
     * Menampilkan semua data buku.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $buku = Buku::all();
        return response()->json($buku, 200);
    }

    /**
     * Menyimpan data buku baru.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul_buku' => 'required|string|max:255',
            'penulis_buku' => 'required|string|max:255',
            'penerbit_buku' => 'required|string|max:255',
            'tahun_terbit_buku' => 'required|integer|between:1900,2100',
        ]);

        $buku = Buku::create($validated);
        return response()->json([
            'message' => 'Buku berhasil ditambahkan',
            'data' => $buku
        ], 201);
    }

    /**
     * Menampilkan detail buku berdasarkan ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $buku = Buku::find($id);

        if (!$buku) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        return response()->json($buku, 200);
    }

    /**
     * Memperbarui data buku berdasarkan ID.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $buku = Buku::find($id);

        if (!$buku) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'judul_buku' => 'sometimes|required|string|max:255',
            'penulis_buku' => 'sometimes|required|string|max:255',
            'penerbit_buku' => 'sometimes|required|string|max:255',
            'tahun_terbit_buku' => 'sometimes|required|integer|between:1900,2100',
        ]);

        $buku->update($validated);
        return response()->json([
            'message' => 'Buku berhasil diperbarui',
            'data' => $buku
        ], 200);
    }

    /**
     * Menghapus buku berdasarkan ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $buku = Buku::find($id);

        if (!$buku) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        $buku->delete();
        return response()->json(['message' => 'Buku berhasil dihapus'], 200);
    }
}
