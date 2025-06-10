const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Pengunjung {
    id: ID!
    nama: String!
    email: String!
    telepon: String
  }

  type Query {
    getAllPengunjung: [Pengunjung!]!
    getPengunjungById(id: ID!): Pengunjung
  }

  type Mutation {
    createPengunjung(
      nama: String!
      email: String!
      telepon: String
    ): Pengunjung!
    updatePengunjung(
      id: ID!
      nama: String
      email: String
      telepon: String
    ): Pengunjung
    deletePengunjung(id: ID!): Boolean!
  }
`;

module.exports = typeDefs; 