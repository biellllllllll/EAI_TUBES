const bukuService = require('../data/buku');

const resolvers = {
  Query: {
    getAllBuku: () => {
      return bukuService.getAllBuku();
    },
    getBukuById: (_, { id }) => {
      return bukuService.getBukuById(id);
    }
  },
  Mutation: {
    createBuku: (_, { judul_buku, penulis_buku, penerbit_buku, tahun_terbit_buku }) => {
      return bukuService.createBuku({
        judul_buku,
        penulis_buku,
        penerbit_buku,
        tahun_terbit_buku
      });
    },
    updateBuku: (_, { id, ...buku }) => {
      const updatedBuku = bukuService.updateBuku(id, buku);
      if (!updatedBuku) {
        throw new Error('Buku tidak ditemukan');
      }
      return updatedBuku;
    },
    deleteBuku: (_, { id }) => {
      const deleted = bukuService.deleteBuku(id);
      if (!deleted) {
        throw new Error('Buku tidak ditemukan');
      }
      return true;
    }
  },
};

module.exports = resolvers;