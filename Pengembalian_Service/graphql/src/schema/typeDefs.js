const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Menambahkan field 'status' karena field ini sekarang menjadi
    # bagian dari data pengembalian.
    type Pengembalian {
        id: ID!
        peminjaman_id: Int!
        tanggal_pengembalian: String!
        status: String!
    }

    type Query {
        getAllPengembalian: [Pengembalian!]!
        getPengembalianById(id: ID!): Pengembalian
    }

    type Mutation {
        # Input untuk create hanya butuh 'peminjaman_id'.
        # 'tanggal_pengembalian' dan 'status' dihitung di server.
        createPengembalian(
            peminjaman_id: Int!
        ): Pengembalian!

        # Input untuk update sekarang menyertakan 'status'.
        # 'peminjaman_id' dihapus karena tidak seharusnya diubah.
        updatePengembalian(
            id: ID!
            tanggal_pengembalian: String
            status: String
        ): Pengembalian

        # Return type sudah benar (Boolean).
        deletePengembalian(id: ID!): Boolean!
    }
`;

module.exports = typeDefs;
