const pengunjungService = require('../data/pengunjung');

const resolvers = {
    Pengunjung: {
    __resolveReference(pengunjung, { dataSources }) {
        return pengunjungService.getPengunjungById(pengunjung.id);
    }
  },
  Query: {
    // Tambahkan async/await
    getAllPengunjung: async () => {
      return await pengunjungService.getAllPengunjung();
    },
    // Tambahkan async/await
    getPengunjungById: async (_, { id }) => {
      return await pengunjungService.getPengunjungById(id);
    }
  },
  Mutation: {
    // Tambahkan async/await
    createPengunjung: async (_, { nama, email, telepon }) => {
      return await pengunjungService.createPengunjung({
        nama,
        email,
        telepon
      });
    },
    // Tambahkan async/await
    updatePengunjung: async (_, { id, ...pengunjung }) => {
      const updatedPengunjung = await pengunjungService.updatePengunjung(id, pengunjung);
      if (!updatedPengunjung) {
        throw new Error('Pengunjung tidak ditemukan');
      }
      return updatedPengunjung;
    },
    // Tambahkan async/await
    deletePengunjung: async (_, { id }) => {
      const deleted = await pengunjungService.deletePengunjung(id);
      if (!deleted) {
        throw new Error('Pengunjung tidak ditemukan');
      }
      return true;
    }
  },
};

module.exports = resolvers;
