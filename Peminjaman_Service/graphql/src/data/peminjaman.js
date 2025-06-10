// Mock data untuk peminjaman
let peminjamanData = [
    {
        id: 1,
        id_pengunjung: 1,
        id_buku: 1,
        tanggal_pinjam: "2024-03-20",
        tanggal_kembali: "2024-03-27",
        status: "dipinjam"
    }
];

// Fungsi untuk mendapatkan semua peminjaman
const getAllPeminjaman = () => {
    return peminjamanData;
};

// Fungsi untuk mendapatkan peminjaman berdasarkan ID
const getPeminjamanById = (id) => {
    return peminjamanData.find(peminjaman => peminjaman.id === parseInt(id));
};

// Fungsi untuk menambahkan peminjaman baru
const createPeminjaman = (peminjaman) => {
    const newPeminjaman = {
        id: peminjamanData.length + 1,
        ...peminjaman,
        status: peminjaman.status || 'dipinjam' // Default status
    };
    peminjamanData.push(newPeminjaman);
    return newPeminjaman;
};

// Fungsi untuk memperbarui peminjaman
const updatePeminjaman = (id, peminjaman) => {
    const index = peminjamanData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    
    peminjamanData[index] = {
        ...peminjamanData[index],
        ...peminjaman
    };
    return peminjamanData[index];
};

// Fungsi untuk menghapus peminjaman
const deletePeminjaman = (id) => {
    const index = peminjamanData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    
    peminjamanData.splice(index, 1);
    return true;
};

module.exports = {
    getAllPeminjaman,
    getPeminjamanById,
    createPeminjaman,
    updatePeminjaman,
    deletePeminjaman
}; 