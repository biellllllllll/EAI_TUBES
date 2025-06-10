const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Denda {
        id: ID!
        id_pengembalian: Int!
        jumlah_denda: Float!
        status_pembayaran: String!
        keterangan: String
        tanggal_pembayaran: String
    }

    type Query {
        getAllDenda: [Denda!]!
        getDendaById(id: ID!): Denda
    }

    type Mutation {
        createDenda(
            id_pengembalian: Int!
            jumlah_denda: Float!
            keterangan: String
        ): Denda!

        updateDenda(
            id: ID!
            jumlah_denda: Float
            keterangan: String
        ): Denda

        deleteDenda(id: ID!): Boolean!

        updateStatusPembayaran(
            id: ID!
            status_pembayaran: String!
            tanggal_pembayaran: String
        ): Denda
    }
`;

module.exports = typeDefs; 