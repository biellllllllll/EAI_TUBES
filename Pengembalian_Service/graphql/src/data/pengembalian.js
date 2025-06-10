// --- Simulasi Data dari Peminjaman Service ---
// Data ini kita gunakan untuk meniru hasil panggilan HTTP ke layanan Peminjaman
// untuk mendapatkan tanggal jatuh tempo.
const peminjamanServiceData = [
    { id: 1, tanggal_pinjam: '2024-03-01T10:00:00Z', tanggal_kembali: '2024-03-08T10:00:00Z' }, // Akan Tepat Waktu
    { id: 2, tanggal_pinjam: '2025-05-20T10:00:00Z', tanggal_kembali: '2025-05-27T10:00:00Z' }, // Akan Terlambat
    { id: 3, tanggal_pinjam: '2025-06-01T10:00:00Z', tanggal_kembali: '2025-06-08T10:00:00Z' }, // Akan Tepat Waktu
];

// Mock data untuk pengembalian, sekarang ditambahkan 'status'
let pengembalianData = [
    {
        id: 1,
        peminjaman_id: 1,
        tanggal_pengembalian: '2024-03-08T10:00:00Z',
        status: 'Tepat Waktu' // Menambahkan field status
    }
];

// --- Fungsi Data Layer ---

// Fungsi untuk mendapatkan semua pengembalian (tidak berubah)
const getAllPengembalian = () => {
    return pengembalianData;
};

// Fungsi untuk mendapatkan pengembalian berdasarkan ID (tidak berubah)
const getPengembalianById = (id) => {
    return pengembalianData.find(pengembalian => pengembalian.id === parseInt(id));
};

/**
 * Fungsi untuk menambahkan pengembalian baru.
 * Logika disesuaikan agar meniru PengembalianController.
 */
const createPengembalian = ({ peminjaman_id }) => {
    // 1. Validasi: Cek apakah peminjaman sudah pernah dikembalikan
    const existingPengembalian = pengembalianData.find(
        p => p.peminjaman_id === peminjaman_id
    );
    if (existingPengembalian) {
        throw new Error('Peminjaman ini sudah pernah dikembalikan sebelumnya.');
    }

    // 2. Simulasi Panggilan Service: Ambil data peminjaman
    const peminjaman = peminjamanServiceData.find(p => p.id === peminjaman_id);
    if (!peminjaman) {
        throw new Error(`Data Peminjaman dengan ID ${peminjaman_id} tidak ditemukan.`);
    }

    // 3. Logika Bisnis: Tentukan tanggal dan status
    const tanggalPengembalianAktual = new Date(); // Menggunakan tanggal & waktu saat ini
    const tanggalJatuhTempo = new Date(peminjaman.tanggal_kembali);

    // Bandingkan tanggal tanpa memperhitungkan waktu
    tanggalPengembalianAktual.setHours(0, 0, 0, 0);
    tanggalJatuhTempo.setHours(0, 0, 0, 0);

    const status = tanggalPengembalianAktual > tanggalJatuhTempo ? 'Terlambat' : 'Tepat Waktu';

    // 4. Buat objek pengembalian baru
    const newPengembalian = {
        id: pengembalianData.length > 0 ? Math.max(...pengembalianData.map(p => p.id)) + 1 : 1,
        peminjaman_id,
        tanggal_pengembalian: tanggalPengembalianAktual.toISOString(),
        status
    };

    pengembalianData.push(newPengembalian);
    return newPengembalian;
};


/**
 * Fungsi untuk memperbarui pengembalian.
 * Disesuaikan untuk hanya menerima 'tanggal_pengembalian' dan 'status'.
 */
const updatePengembalian = (id, { tanggal_pengembalian, status }) => {
    const index = pengembalianData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null; // Atau throw new Error('Pengembalian tidak ditemukan');

    // Buat objek update hanya dengan field yang ada di input
    const updateData = {};
    if (tanggal_pengembalian !== undefined) {
        updateData.tanggal_pengembalian = tanggal_pengembalian;
    }
    if (status !== undefined) {
        // Validasi sederhana untuk status
        if (['Tepat Waktu', 'Terlambat'].includes(status)) {
            updateData.status = status;
        } else {
             throw new Error("Status harus 'Tepat Waktu' atau 'Terlambat'");
        }
    }

    // Gabungkan data lama dengan data baru yang valid
    pengembalianData[index] = {
        ...pengembalianData[index],
        ...updateData
    };

    return pengembalianData[index];
};


// Fungsi untuk menghapus pengembalian (tidak berubah)
const deletePengembalian = (id) => {
    const index = pengembalianData.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;

    pengembalianData.splice(index, 1);
    return true; // Konfirmasi berhasil dihapus
};

module.exports = {
    getAllPengembalian,
    getPengembalianById,
    createPengembalian,
    updatePengembalian,
    deletePengembalian
};
