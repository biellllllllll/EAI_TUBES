// Mock data untuk buku
let bukuData = [
    {
        id: 1,
        judul_buku: "Laskar Pelangi",
        penulis_buku: "Andrea Hirata",
        penerbit_buku: "Bentang Pustaka",
        tahun_terbit_buku: 2005
    }
];

// Fungsi untuk mendapatkan semua buku
const getAllBuku = () => {
    return bukuData;
};

// Fungsi untuk mendapatkan buku berdasarkan ID
const getBukuById = (id) => {
    return bukuData.find(buku => buku.id === parseInt(id));
};

// Fungsi untuk menambahkan buku baru
const createBuku = (buku) => {
    const newBuku = {
        id: bukuData.length + 1,
        ...buku
    };
    bukuData.push(newBuku);
    return newBuku;
};

// Fungsi untuk memperbarui buku
const updateBuku = (id, buku) => {
    const index = bukuData.findIndex(b => b.id === parseInt(id));
    if (index === -1) return null;
    
    bukuData[index] = {
        ...bukuData[index],
        ...buku
    };
    return bukuData[index];
};

// Fungsi untuk menghapus buku
const deleteBuku = (id) => {
    const index = bukuData.findIndex(b => b.id === parseInt(id));
    if (index === -1) return false;
    
    bukuData.splice(index, 1);
    return true;
};

module.exports = {
    getAllBuku,
    getBukuById,
    createBuku,
    updateBuku,
    deleteBuku
}; 