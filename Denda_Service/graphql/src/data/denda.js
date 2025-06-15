// File: Denda_Service/graphql/src/data/denda.js (Versi Final)
const pool = require('../db/mysql');
const axios = require('axios');

const PENGEMBALIAN_SERVICE_URL = 'http://localhost:4003/graphql';

const dendaService = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT id_denda, id_pengembalian, jumlah_denda, keterangan FROM denda');
    // Mapping dari nama kolom DB ke nama field GraphQL
    return rows.map(row => ({
      id: row.id_denda,
      id_pengembalian: row.id_pengembalian,
      jumlah_denda: row.jumlah_denda,
      keterangan: row.keterangan
    }));
  },

  getById: async (id) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    const [rows] = await pool.query('SELECT id_denda, id_pengembalian, jumlah_denda, keterangan FROM denda WHERE id_denda = ?', [numericId]);
    if (rows.length === 0) return null;
    const row = rows[0];
    // Mapping dari nama kolom DB ke nama field GraphQL
    return {
      id: row.id_denda,
      id_pengembalian: row.id_pengembalian,
      jumlah_denda: row.jumlah_denda,
      keterangan: row.keterangan
    };
  },

  create: async ({ id_pengembalian, jumlah_denda, keterangan }) => {
    try {
      const queryCheck = { query: `query { getPengembalianById(id: "${id_pengembalian}") { id } }` };
      const response = await axios.post(PENGEMBALIAN_SERVICE_URL, queryCheck);
      if (!response.data.data.getPengembalianById) {
        throw new Error('Data Pengembalian dengan ID tersebut tidak ditemukan.');
      }

      // Menyesuaikan nama kolom dengan tabel Anda: id_denda (auto), id_pengembalian, jumlah_denda, keterangan
      const [result] = await pool.query(
        'INSERT INTO denda (id_pengembalian, jumlah_denda, keterangan) VALUES (?, ?, ?)',
        [id_pengembalian, jumlah_denda, keterangan]
      );
      const newId = result.insertId;

      return { id: newId, id_pengembalian, jumlah_denda, keterangan };
    } catch (error) {
      if (error.isAxiosError) {
        throw new Error('Terjadi masalah saat validasi data, Pengembalian_Service mungkin tidak berjalan.');
      }
      throw error;
    }
  }
};

module.exports = dendaService;
