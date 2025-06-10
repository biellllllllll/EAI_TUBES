// Mock data untuk denda
let dendaData = [
    {
        id: 1,
        id_pengembalian: 1,
        jumlah_denda: 50000,
        status_pembayaran: 'belum_bayar',
        keterangan: 'Keterlambatan pengembalian buku',
        tanggal_pembayaran: null
    }
];

// Fungsi untuk mendapatkan semua denda
const getAllDenda = () => {
    return dendaData;
};

// Fungsi untuk mendapatkan denda berdasarkan ID
const getDendaById = (id) => {
    return dendaData.find(denda => denda.id === parseInt(id));
};

// Fungsi untuk menambahkan denda baru
const createDenda = (denda) => {
    const newDenda = {
        id: dendaData.length + 1,
        status_pembayaran: 'belum_bayar',
        tanggal_pembayaran: null,
        ...denda
    };
    dendaData.push(newDenda);
    return newDenda;
};

// Fungsi untuk memperbarui denda
const updateDenda = (id, denda) => {
    const index = dendaData.findIndex(d => d.id === parseInt(id));
    if (index === -1) return null;
    
    dendaData[index] = {
        ...dendaData[index],
        ...denda
    };
    return dendaData[index];
};

// Fungsi untuk menghapus denda
const deleteDenda = (id) => {
    const index = dendaData.findIndex(d => d.id === parseInt(id));
    if (index === -1) return false;
    
    dendaData.splice(index, 1);
    return true;
};

// Fungsi untuk memperbarui status pembayaran
const updateStatusPembayaran = (id, statusData) => {
    const index = dendaData.findIndex(d => d.id === parseInt(id));
    if (index === -1) return null;

    const updateData = {
        status_pembayaran: statusData.status_pembayaran
    };

    if (statusData.tanggal_pembayaran) {
        updateData.tanggal_pembayaran = statusData.tanggal_pembayaran;
    } else if (statusData.status_pembayaran === 'sudah_bayar' && !dendaData[index].tanggal_pembayaran) {
        updateData.tanggal_pembayaran = new Date().toISOString();
    } else if (statusData.status_pembayaran === 'belum_bayar') {
        updateData.tanggal_pembayaran = null;
    }

    dendaData[index] = {
        ...dendaData[index],
        ...updateData
    };
    return dendaData[index];
};

module.exports = {
    getAllDenda,
    getDendaById,
    createDenda,
    updateDenda,
    deleteDenda,
    updateStatusPembayaran
}; 