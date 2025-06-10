const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Buku {
    id: ID!
    judul_buku: String!
    penulis_buku: String!
    penerbit_buku: String!
    tahun_terbit_buku: Int!
  }

  type Query {
    getAllBuku: [Buku!]!
    getBukuById(id: ID!): Buku
  }

  type Mutation {
    createBuku(
      judul_buku: String!
      penulis_buku: String!
      penerbit_buku: String!
      tahun_terbit_buku: Int!
    ): Buku!
    updateBuku(
      id: ID!
      judul_buku: String
      penulis_buku: String
      penerbit_buku: String
      tahun_terbit_buku: Int
    ): Buku
    deleteBuku(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;