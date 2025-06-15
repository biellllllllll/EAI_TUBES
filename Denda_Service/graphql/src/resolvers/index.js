// File: Denda_Service/graphql/src/resolvers/index.js (Versi Final)
const dendaService = require('../data/denda');

const resolvers = {
  Denda: {
    __resolveReference(denda) {
      return dendaService.getById(denda.id);
    },
    pengembalian(denda) {
      // Data 'denda' di sini sudah di-mapping oleh service, jadi propertinya sudah benar
      return { __typename: "Pengembalian", id: denda.id_pengembalian };
    }
  },

  Query: {
    getAllDenda: async () => await dendaService.getAll(),
    getDendaById: async (_, { id }) => await dendaService.getById(id),
  },

  Mutation: {
    createDenda: async (_, args) => await dendaService.create(args),
  }
};

module.exports = resolvers;
