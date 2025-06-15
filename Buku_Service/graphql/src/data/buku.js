// Impor pool koneksi database
const pool = require('../db/mysql');

const bukuService = {
  // GET ALL
  getAllBuku: async () => {
    const [rows] = await pool.query('SELECT * FROM buku');
    return rows;
  },

  // GET BY ID
  getBukuById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM buku WHERE id = ?', [id]);
    return rows[0] || null; // Kembalikan buku atau null jika tidak ada
  },

  // CREATE
  createBuku: async ({ judul_buku, penulis_buku, penerbit_buku, tahun_terbit_buku }) => {
    const [result] = await pool.query(
      'INSERT INTO buku (judul_buku, penulis_buku, penerbit_buku, tahun_terbit_buku) VALUES (?, ?, ?, ?)',
      [judul_buku, penulis_buku, penerbit_buku, tahun_terbit_buku]
    );
    const id = result.insertId;
    return { id, judul_buku, penulis_buku, penerbit_buku, tahun_terbit_buku };
  },

  // UPDATE
  updateBuku: async (id, { judul_buku, penulis_buku, penerbit_buku, tahun_terbit_buku }) => {
    // Bangun query secara dinamis untuk hanya memperbarui field yang diberikan
    const fields = [];
    const values = [];
    if (judul_buku !== undefined) { fields.push('judul_buku = ?'); values.push(judul_buku); }
    if (penulis_buku !== undefined) { fields.push('penulis_buku = ?'); values.push(penulis_buku); }
    if (penerbit_buku !== undefined) { fields.push('penerbit_buku = ?'); values.push(penerbit_buku); }
    if (tahun_terbit_buku !== undefined) { fields.push('tahun_terbit_buku = ?'); values.push(tahun_terbit_buku); }

    if (fields.length === 0) {
      // Jika tidak ada yang diupdate, kembalikan data yang ada
      return await bukuService.getBukuById(id);
    }

    values.push(id); // Tambahkan ID untuk klausa WHERE

    const [result] = await pool.query(
      `UPDATE buku SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null; // Buku tidak ditemukan
    }

    return await bukuService.getBukuById(id); // Kembalikan data buku yang sudah terupdate
  },

  // DELETE
  deleteBuku: async (id) => {
    const [result] = await pool.query('DELETE FROM buku WHERE id = ?', [id]);
    // `affectedRows` akan bernilai 1 jika berhasil dihapus, 0 jika tidak ada ID yang cocok
    return result.affectedRows > 0;
  }
};

module.exports = bukuService;
