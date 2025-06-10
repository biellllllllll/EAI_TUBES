const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Peminjaman {
    id: ID!
    id_pengunjung: Int!
    id_buku: Int!
    tanggal_pinjam: String!
    tanggal_kembali: String!
    status: String!
  }

  type Query {
    getAllPeminjaman: [Peminjaman!]!
    getPeminjamanById(id: ID!): Peminjaman
  }

  type Mutation {
    createPeminjaman(
      id_pengunjung: Int!
      id_buku: Int!
      tanggal_pinjam: String!
      tanggal_kembali: String!
      status: String
    ): Peminjaman!
    updatePeminjaman(
      id: ID!
      id_pengunjung: Int
      id_buku: Int
      tanggal_pinjam: String
      tanggal_kembali: String
      status: String
    ): Peminjaman
    deletePeminjaman(id: ID!): Boolean!
  }
`;

module.exports = typeDefs; 