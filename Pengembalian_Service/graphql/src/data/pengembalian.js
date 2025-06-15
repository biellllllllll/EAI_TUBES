// File: Pengembalian_Service/graphql/src/data/pengembalian.js (Versi Final & Lengkap)

const pool = require('../db/mysql');
const axios = require('axios');

const PEMINJAMAN_SERVICE_URL = 'http://localhost:4002/graphql';

// Fungsi helper untuk mapping, agar tidak duplikasi kode
const mapRowToPengembalian = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        id_peminjaman: row.peminjaman_id, // <--- MAPPING PENTING DARI DB KE GQL
        tanggal_pengembalian: row.tanggal_pengembalian,
        status: row.status
    };
};

const pengembalianService = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM pengembalian');
    // Gunakan helper mapping di sini
    return rows.map(mapRowToPengembalian);
  },

  getById: async (id) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    const [rows] = await pool.query('SELECT * FROM pengembalian WHERE id = ?', [numericId]);
    // Gunakan helper mapping di sini
    return mapRowToPengembalian(rows[0]);
  },

  create: async ({ id_peminjaman, tanggal_pengembalian, status }) => {
    try {
      const [existingReturns] = await pool.query('SELECT id FROM pengembalian WHERE peminjaman_id = ?', [id_peminjaman]);
      if (existingReturns.length > 0) {
        throw new Error('Peminjaman ini sudah pernah dikembalikan sebelumnya.');
      }

      const queryCheck = { query: `query { getPeminjamanById(id: "${id_peminjaman}") { id } }` };
      const response = await axios.post(PEMINJAMAN_SERVICE_URL, queryCheck);
      if (!response.data.data.getPeminjamanById) {
        throw new Error('Peminjaman dengan ID tersebut tidak ditemukan.');
      }

      const [result] = await pool.query(
        'INSERT INTO pengembalian (peminjaman_id, tanggal_pengembalian, status) VALUES (?, ?, ?)',
        [id_peminjaman, tanggal_pengembalian, status]
      );
      const id = result.insertId;

      // Kembalikan data yang sudah di-mapping agar konsisten
      return { id, id_peminjaman, tanggal_pengembalian, status };
    } catch (error) {
      if (error.isAxiosError) {
        throw new Error('Terjadi masalah saat validasi data, Peminjaman_Service mungkin tidak berjalan.');
      }
      throw error;
    }
  }
};

module.exports = pengembalianService;
