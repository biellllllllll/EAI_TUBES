// File: Pengembalian_Service/graphql/src/schema/typeDefs.js (Versi Final)
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  extend type Peminjaman @key(fields: "id") {
    id: ID! @external
  }

  type Pengembalian @key(fields: "id") {
    id: ID!
    id_peminjaman: Int!
    tanggal_pengembalian: Date!
    status: String # Mengganti keterangan menjadi status
    peminjaman: Peminjaman
  }

  type Query {
    getAllPengembalian: [Pengembalian]
    getPengembalianById(id: ID!): Pengembalian
  }

  type Mutation {
    # Mengganti argumen keterangan menjadi status
    createPengembalian(id_peminjaman: Int!, tanggal_pengembalian: Date!, status: String): Pengembalian
  }
`;

module.exports = typeDefs;
