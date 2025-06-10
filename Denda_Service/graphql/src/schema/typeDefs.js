const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # Menghapus status_pembayaran dan tanggal_pembayaran
    # agar sesuai dengan model data yang sudah disederhanakan.
    type Denda {
        id: ID!
        id_pengembalian: Int!
        jumlah_denda: Float!
        keterangan: String
    }

    type Query {
        getAllDenda: [Denda!]!
        getDendaById(id: ID!): Denda
    }

    type Mutation {
        # createDenda dan updateDenda sudah sesuai dengan perubahan sebelumnya.
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

        # Mutasi 'updateStatusPembayaran' dihapus seluruhnya karena
        # fiturnya sudah tidak ada lagi di controller dan resolver.
    }
`;

module.exports = typeDefs;
