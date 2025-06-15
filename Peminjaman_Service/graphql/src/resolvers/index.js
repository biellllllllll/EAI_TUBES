const peminjamanService = require('../data/peminjaman');
const { GraphQLScalarType, Kind } = require('graphql');

// --- IMPLEMENTASI LENGKAP UNTUK DATE SCALAR ---
const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString(); // Mengubah Date object dari server menjadi string ISO
    }
    throw new Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value) {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date; // Mengubah string dari klien menjadi Date object
      }
    }
    throw new Error('GraphQL Date Scalar parser expected a valid date string');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value);
      if (!isNaN(date.getTime())) {
        return date; // Mengubah string dari query inline menjadi Date object
      }
    }
    throw new Error('GraphQL Date Scalar parser expected a string literal');
  },
});

const resolvers = {
  // Mendaftarkan resolver untuk scalar Date
  Date: dateScalar,

  Peminjaman: {
    // __resolveReference harus async karena memanggil service async
    async __resolveReference(peminjaman) {
      return await peminjamanService.getPeminjamanById(peminjaman.id);
    },
    // Resolver ini sinkron karena hanya membuat objek stub
    pengunjung(peminjaman) {
      return { __typename: "Pengunjung", id: peminjaman.id_pengunjung };
    },
    buku(peminjaman) {
      return { __typename: "Buku", id: peminjaman.id_buku };
    }
  },

  Query: {
    // Menambahkan async/await
    getAllPeminjaman: async () => {
      return await peminjamanService.getAllPeminjaman();
    },
    // Menambahkan async/await
    getPeminjamanById: async (_, { id }) => {
      return await peminjamanService.getPeminjamanById(id);
    },
  },

  Mutation: {
    // Menambahkan async/await
    createPeminjaman: async (_, args) => {
      return await peminjamanService.createPeminjaman(args);
    },

    // --- RESOLVER MUTATION DILENGKAPI ---
    // Menambahkan async/await
    updatePeminjaman: async (_, { id, ...input }) => {
        const updatedPeminjaman = await peminjamanService.updatePeminjaman(id, input);
        if (!updatedPeminjaman) {
            throw new Error('Peminjaman tidak ditemukan saat update.');
        }
        return updatedPeminjaman;
    },
    // Menambahkan async/await
    deletePeminjaman: async (_, { id }) => {
        const deleted = await peminjamanService.deletePeminjaman(id);
        if (!deleted) {
            throw new Error('Peminjaman tidak ditemukan saat hapus.');
        }
        return true;
    }
  }
};

module.exports = resolvers;
