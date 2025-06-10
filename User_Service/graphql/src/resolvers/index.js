const pengunjungService = require('../data/pengunjung');

const resolvers = {
  Query: {
    getAllPengunjung: () => {
      return pengunjungService.getAllPengunjung();
    },
    getPengunjungById: (_, { id }) => {
      return pengunjungService.getPengunjungById(id);
    }
  },
  Mutation: {
    createPengunjung: (_, { nama, email, telepon }) => {
      return pengunjungService.createPengunjung({
        nama,
        email,
        telepon
      });
    },
    updatePengunjung: (_, { id, ...pengunjung }) => {
      const updatedPengunjung = pengunjungService.updatePengunjung(id, pengunjung);
      if (!updatedPengunjung) {
        throw new Error('Pengunjung tidak ditemukan');
      }
      return updatedPengunjung;
    },
    deletePengunjung: (_, { id }) => {
      const deleted = pengunjungService.deletePengunjung(id);
      if (!deleted) {
        throw new Error('Pengunjung tidak ditemukan');
      }
      return true;
    }
  },
};

module.exports = resolvers; 