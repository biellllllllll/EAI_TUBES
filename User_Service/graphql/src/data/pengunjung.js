// Mock data untuk pengunjung
let pengunjungData = [
    {
        id: 1,
        nama: "John Doe",
        email: "john@example.com",
        telepon: "08123456789"
    }
];

// Fungsi untuk mendapatkan semua pengunjung
const getAllPengunjung = () => {
    return pengunjungData;
};

// Fungsi untuk mendapatkan pengunjung berdasarkan ID
const getPengunjungById = (id) => {
    return pengunjungData.find(pengunjung => pengunjung.id === parseInt(id));
};

// Fungsi untuk menambahkan pengunjung baru
const createPengunjung = (pengunjung) => {
    const newPengunjung = {
        id: pengunjungData.length + 1,
        ...pengunjung
    };
    pengunjungData.push(newPengunjung);
    return newPengunjung;
};

// Fungsi untuk memperbarui pengunjung
const updatePengunjung = (id, pengunjung) => {
    const index = pengunjungData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    
    pengunjungData[index] = {
        ...pengunjungData[index],
        ...pengunjung
    };
    return pengunjungData[index];
};

// Fungsi untuk menghapus pengunjung
const deletePengunjung = (id) => {
    const index = pengunjungData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    
    pengunjungData.splice(index, 1);
    return true;
};

module.exports = {
    getAllPengunjung,
    getPengunjungById,
    createPengunjung,
    updatePengunjung,
    deletePengunjung
}; 