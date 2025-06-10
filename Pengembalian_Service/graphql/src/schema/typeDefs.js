const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Pengembalian {
        id: ID!
        peminjaman_id: Int!
        tanggal_pengembalian: String!
    }

    type Query {
        getAllPengembalian: [Pengembalian!]!
        getPengembalianById(id: ID!): Pengembalian
    }

    type Mutation {
        createPengembalian(
            peminjaman_id: Int!
            tanggal_pengembalian: String!
        ): Pengembalian!

        updatePengembalian(
            id: ID!
            peminjaman_id: Int
            tanggal_pengembalian: String
        ): Pengembalian

        deletePengembalian(id: ID!): Boolean!
    }
`;

module.exports = typeDefs; 