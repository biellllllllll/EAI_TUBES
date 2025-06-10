const peminjamanService = require('../data/peminjaman');

const resolvers = {
  Query: {
    getAllPeminjaman: () => {
      return peminjamanService.getAllPeminjaman();
    },
    getPeminjamanById: (_, { id }) => {
      return peminjamanService.getPeminjamanById(id);
    }
  },
  Mutation: {
    createPeminjaman: (_, { id_pengunjung, id_buku, tanggal_pinjam, tanggal_kembali, status }) => {
      return peminjamanService.createPeminjaman({
        id_pengunjung,
        id_buku,
        tanggal_pinjam,
        tanggal_kembali,
        status
      });
    },
    updatePeminjaman: (_, { id, ...peminjaman }) => {
      const updatedPeminjaman = peminjamanService.updatePeminjaman(id, peminjaman);
      if (!updatedPeminjaman) {
        throw new Error('Peminjaman tidak ditemukan');
      }
      return updatedPeminjaman;
    },
    deletePeminjaman: (_, { id }) => {
      const deleted = peminjamanService.deletePeminjaman(id);
      if (!deleted) {
        throw new Error('Peminjaman tidak ditemukan');
      }
      return true;
    }
  },
};

module.exports = resolvers; 