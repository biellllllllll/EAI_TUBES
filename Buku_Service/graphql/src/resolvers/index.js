const bukuService = require('../data/buku');

const resolvers = {
    Buku: {
    __resolveReference(buku, { dataSources }) {
      return bukuService.getBukuById(buku.id);
    }
  },
  Query: {
    // Tambahkan async dan await
    getAllBuku: async () => {
      return await bukuService.getAllBuku();
    },
    // Tambahkan async dan await
    getBukuById: async (_, { id }) => {
      return await bukuService.getBukuById(id);
    }
  },
  Mutation: {
    // Tambahkan async dan await
    createBuku: async (_, { judul_buku, penulis_buku, penerbit_buku, tahun_terbit_buku }) => {
      return await bukuService.createBuku({
        judul_buku,
        penulis_buku,
        penerbit_buku,
        tahun_terbit_buku
      });
    },
    // Tambahkan async dan await
    updateBuku: async (_, { id, ...buku }) => {
      const updatedBuku = await bukuService.updateBuku(id, buku);
      if (!updatedBuku) {
        throw new Error('Buku tidak ditemukan');
      }
      return updatedBuku;
    },
    // Tambahkan async dan await
    deleteBuku: async (_, { id }) => {
      const deleted = await bukuService.deleteBuku(id);
      if (!deleted) {
        throw new Error('Buku tidak ditemukan');
      }
      return true; // Tetap mengembalikan boolean
    }
  },
};

module.exports = resolvers;
