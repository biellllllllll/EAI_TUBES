// Mock data untuk pengembalian
let pengembalianData = [
    {
        id: 1,
        peminjaman_id: 1,
        tanggal_pengembalian: '2024-03-08T10:00:00Z'
    }
];

// Fungsi untuk mendapatkan semua pengembalian
const getAllPengembalian = () => {
    return pengembalianData;
};

// Fungsi untuk mendapatkan pengembalian berdasarkan ID
const getPengembalianById = (id) => {
    return pengembalianData.find(pengembalian => pengembalian.id === parseInt(id));
};

// Fungsi untuk menambahkan pengembalian baru
const createPengembalian = (pengembalian) => {
    // Check if peminjaman_id already exists
    const existingPengembalian = pengembalianData.find(
        p => p.peminjaman_id === pengembalian.peminjaman_id
    );
    
    if (existingPengembalian) {
        throw new Error('Peminjaman ID sudah ada dalam data pengembalian');
    }

    const newPengembalian = {
        id: pengembalianData.length + 1,
        ...pengembalian
    };
    pengembalianData.push(newPengembalian);
    return newPengembalian;
};

// Fungsi untuk memperbarui pengembalian
const updatePengembalian = (id, pengembalian) => {
    const index = pengembalianData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    
    pengembalianData[index] = {
        ...pengembalianData[index],
        ...pengembalian
    };
    return pengembalianData[index];
};

// Fungsi untuk menghapus pengembalian
const deletePengembalian = (id) => {
    const index = pengembalianData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    
    pengembalianData.splice(index, 1);
    return true;
};

module.exports = {
    getAllPengembalian,
    getPengembalianById,
    createPengembalian,
    updatePengembalian,
    deletePengembalian
}; 