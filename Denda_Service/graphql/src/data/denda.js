// Mock data untuk denda, disederhanakan tanpa status & tanggal pembayaran
let dendaData = [
    {
        id: 1,
        id_pengembalian: 1,
        jumlah_denda: 50000,
        keterangan: 'Terlambat 2 hari'
        // Menghapus field status_pembayaran dan tanggal_pembayaran
    }
];

// Fungsi untuk mendapatkan semua denda (tidak berubah)
const getAllDenda = () => {
    return dendaData;
};

// Fungsi untuk mendapatkan denda berdasarkan ID (tidak berubah)
const getDendaById = (id) => {
    return dendaData.find(denda => denda.id === parseInt(id));
};

// Fungsi untuk menambahkan denda baru (disederhanakan)
const createDenda = (denda) => {
    const newDenda = {
        // Menggunakan cara yang lebih aman untuk generate ID
        id: dendaData.length > 0 ? Math.max(...dendaData.map(d => d.id)) + 1 : 1,
        // Tidak ada lagi penambahan status_pembayaran atau tanggal_pembayaran
        ...denda
    };
    dendaData.push(newDenda);
    return newDenda;
};

// Fungsi untuk memperbarui denda (tidak berubah, sudah sesuai)
const updateDenda = (id, denda) => {
    const index = dendaData.findIndex(d => d.id === parseInt(id));
    if (index === -1) return null;

    dendaData[index] = {
        ...dendaData[index],
        ...denda
    };
    return dendaData[index];
};

// Fungsi untuk menghapus denda (tidak berubah, sudah sesuai)
const deleteDenda = (id) => {
    const index = dendaData.findIndex(d => d.id === parseInt(id));
    if (index === -1) return false;

    dendaData.splice(index, 1);
    return true;
};

// Fungsi 'updateStatusPembayaran' dihapus seluruhnya karena tidak lagi relevan

// Ekspor fungsi-fungsi yang masih digunakan
module.exports = {
    getAllDenda,
    getDendaById,
    createDenda,
    updateDenda,
    deleteDenda
    // Menghapus 'updateStatusPembayaran' dari exports
};
