// File: Pengembalian_Service/graphql/src/resolvers/index.js (Versi Final)
const { GraphQLScalarType, Kind } = require('graphql');
const pengembalianService = require('../data/pengembalian');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize: (value) => value instanceof Date ? value.toISOString() : null,
  parseValue: (value) => typeof value === 'string' ? new Date(value) : null,
  parseLiteral: (ast) => ast.kind === Kind.STRING ? new Date(ast.value) : null,
});

const resolvers = {
  Date: dateScalar,

  Pengembalian: {
    peminjaman(pengembalian) {
      // Ini sudah benar, karena kita ingin mencari berdasarkan id_peminjaman dari DB
      return { __typename: "Peminjaman", id: pengembalian.id_peminjaman };
    },
    // --- PERBAIKAN DI SINI ---
    // Resolver ini harus membaca properti yang dikembalikan oleh service.
    // Service kita mengembalikan objek dengan properti 'id_peminjaman'.
    id_peminjaman(pengembalian) {
      return pengembalian.id_peminjaman; // Sebelumnya: pengembalian.peminjaman_id
    }
  },

  Query: {
    getAllPengembalian: async () => await pengembalianService.getAll(),
    getPengembalianById: async (_, { id }) => await pengembalianService.getById(id),
  },

  Mutation: {
    createPengembalian: async (_, args) => await pengembalianService.create(args),
  }
};

module.exports = resolvers;
