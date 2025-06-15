// Impor pool koneksi database
const pool = require('../db/mysql');
const axios = require('axios');

const USER_SERVICE_URL = 'http://localhost:4001/graphql';
const BUKU_SERVICE_URL = 'http://localhost:4000/graphql';

// Fungsi untuk mendapatkan semua peminjaman
const getAllPeminjaman = async () => {
    const [rows] = await pool.query('SELECT * FROM peminjaman');
    return rows;
};

// --- FUNGSI INI DISESUAIKAN ---
// Fungsi untuk mendapatkan peminjaman berdasarkan ID
const getPeminjamanById = async (id) => {
    // Konversi ID menjadi Angka untuk memastikan perbandingan yang akurat
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return null; // Jika ID tidak valid, langsung kembalikan null
    }
    const [rows] = await pool.query('SELECT * FROM peminjaman WHERE id = ?', [numericId]);
    return rows[0] || null;
};

// Fungsi untuk menambahkan peminjaman baru (logika validasi sudah baik)
const createPeminjaman = async (peminjaman) => {
    const { id_pengunjung, id_buku, tanggal_pinjam, tanggal_kembali } = peminjaman;
    const status = peminjaman.status || 'dipinjam';

    try {
        // Validasi ke service lain
        const queryCheckPengunjung = { query: `query { getPengunjungById(id: "${id_pengunjung}") { id } }` };
        const queryCheckBuku = { query: `query { getBukuById(id: "${id_buku}") { id } }` };

        const [responsePengunjung, responseBuku] = await Promise.all([
            axios.post(USER_SERVICE_URL, queryCheckPengunjung),
            axios.post(BUKU_SERVICE_URL, queryCheckBuku)
        ]);

        if (!responsePengunjung.data.data.getPengunjungById) {
            throw new Error('Pengunjung dengan ID tersebut tidak ditemukan.');
        }
        if (!responseBuku.data.data.getBukuById) {
            throw new Error('Buku dengan ID tersebut tidak ditemukan.');
        }

        // Jika valid, simpan ke database
        const [result] = await pool.query(
            'INSERT INTO peminjaman (id_pengunjung, id_buku, tanggal_pinjam, tanggal_kembali, status) VALUES (?, ?, ?, ?, ?)',
            [id_pengunjung, id_buku, tanggal_pinjam, tanggal_kembali, status]
        );
        const id = result.insertId;
        return { id, id_pengunjung, id_buku, tanggal_pinjam, tanggal_kembali, status };

    } catch (error) {
        if (error.isAxiosError) {
            console.error('Gagal menghubungi service lain:', error.message);
            throw new Error('Terjadi masalah saat validasi data, service lain mungkin tidak berjalan.');
        }
        throw error;
    }
};

// --- FUNGSI INI DISESUAIKAN ---
// Fungsi untuk memperbarui peminjaman
const updatePeminjaman = async (id, peminjaman) => {
    // Konversi ID menjadi Angka
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return null; // ID tidak valid
    }

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(peminjaman)) {
        if (value !== undefined) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) {
        return await getPeminjamanById(numericId);
    }

    values.push(numericId); // Gunakan numericId untuk klausa WHERE

    const [result] = await pool.query(
        `UPDATE peminjaman SET ${fields.join(', ')} WHERE id = ?`,
        values
    );

    if (result.affectedRows === 0) {
        return null; // Peminjaman tidak ditemukan
    }

    return await getPeminjamanById(numericId);
};

// --- FUNGSI INI DISESUAIKAN ---
// Fungsi untuk menghapus peminjaman
const deletePeminjaman = async (id) => {
    // Konversi ID menjadi Angka
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return false; // ID tidak valid, tidak ada yang dihapus
    }
    const [result] = await pool.query('DELETE FROM peminjaman WHERE id = ?', [numericId]);
    return result.affectedRows > 0;
};

module.exports = {
    getAllPeminjaman,
    getPeminjamanById,
    createPeminjaman,
    updatePeminjaman,
    deletePeminjaman
};
