const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  extend type Buku @key(fields: "id") {
    id: ID! @external
  }

  extend type Pengunjung @key(fields: "id") {
    id: ID! @external
  }

  type Peminjaman @key(fields: "id") {
    id: ID!
    id_pengunjung: Int!
    id_buku: Int!
    tanggal_pinjam: Date!
    tanggal_kembali: Date!
    status: String!
    pengunjung: Pengunjung
    buku: Buku
  }

  type Query {
    getAllPeminjaman: [Peminjaman]
    getPeminjamanById(id: ID!): Peminjaman
  }

  type Mutation {
    createPeminjaman(id_pengunjung: Int!, id_buku: Int!, tanggal_pinjam: Date!, tanggal_kembali: Date!): Peminjaman!
    updatePeminjaman(id: ID!, tanggal_pinjam: Date, tanggal_kembali: Date, status: String): Peminjaman
    deletePeminjaman(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
