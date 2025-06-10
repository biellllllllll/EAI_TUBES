const {
    getAllDenda,
    getDendaById,
    createDenda,
    updateDenda,
    deleteDenda,
    updateStatusPembayaran
} = require('../data/denda');

const resolvers = {
    Query: {
        getAllDenda: () => getAllDenda(),
        getDendaById: (_, { id }) => getDendaById(id)
    },

    Mutation: {
        createDenda: (_, { id_pengembalian, jumlah_denda, keterangan }) => {
            return createDenda({
                id_pengembalian,
                jumlah_denda,
                keterangan
            });
        },

        updateDenda: (_, { id, jumlah_denda, keterangan }) => {
            return updateDenda(id, {
                jumlah_denda,
                keterangan
            });
        },

        deleteDenda: (_, { id }) => {
            return deleteDenda(id);
        },

        updateStatusPembayaran: (_, { id, status_pembayaran, tanggal_pembayaran }) => {
            return updateStatusPembayaran(id, {
                status_pembayaran,
                tanggal_pembayaran
            });
        }
    }
};

module.exports = resolvers; 