// File: Denda_Service/graphql/src/schema/typeDefs.js (Versi Final)
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend type Pengembalian @key(fields: "id") {
    id: ID! @external
  }

  type Denda @key(fields: "id") {
    id: ID!
    id_pengembalian: Int!
    jumlah_denda: Int!
    keterangan: String # Mengganti status_pembayaran menjadi keterangan
    pengembalian: Pengembalian
  }

  type Query {
    getAllDenda: [Denda]
    getDendaById(id: ID!): Denda
  }

  type Mutation {
    # Mengganti argumen agar sesuai dengan tabel
    createDenda(id_pengembalian: Int!, jumlah_denda: Int!, keterangan: String): Denda
  }
`;

module.exports = typeDefs;
