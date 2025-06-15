// Impor pool koneksi database
const pool = require('../db/mysql');

// Fungsi untuk mendapatkan semua pengunjung
const getAllPengunjung = async () => {
    const [rows] = await pool.query('SELECT * FROM pengunjung');
    return rows;
};

// Fungsi untuk mendapatkan pengunjung berdasarkan ID
const getPengunjungById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM pengunjung WHERE id = ?', [id]);
    return rows[0] || null;
};

// Fungsi untuk menambahkan pengunjung baru
const createPengunjung = async ({ nama, email, telepon }) => {
    const [result] = await pool.query(
        'INSERT INTO pengunjung (nama, email, telepon) VALUES (?, ?, ?)',
        [nama, email, telepon]
    );
    const id = result.insertId;
    return { id, nama, email, telepon };
};

// Fungsi untuk memperbarui pengunjung
const updatePengunjung = async (id, pengunjung) => {
    // Cek dulu apakah pengunjung ada
    const existing = await getPengunjungById(id);
    if (!existing) return null;

    // Gabungkan data lama dengan data baru
    const updatedData = { ...existing, ...pengunjung };

    const { nama, email, telepon } = updatedData;
    await pool.query(
        'UPDATE pengunjung SET nama = ?, email = ?, telepon = ? WHERE id = ?',
        [nama, email, telepon, id]
    );

    return await getPengunjungById(id); // Kembalikan data yang sudah terupdate
};

// Fungsi untuk menghapus pengunjung
const deletePengunjung = async (id) => {
    const [result] = await pool.query('DELETE FROM pengunjung WHERE id = ?', [id]);
    return result.affectedRows > 0; // true jika ada baris yang terhapus
};

module.exports = {
    getAllPengunjung,
    getPengunjungById,
    createPengunjung,
    updatePengunjung,
    deletePengunjung
};
