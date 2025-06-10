const {
    getAllDenda,
    getDendaById,
    createDenda,
    updateDenda,
    deleteDenda
    // Menghapus 'updateStatusPembayaran' dari import karena sudah tidak digunakan
} = require('../data/denda');

const resolvers = {
    Query: {
        getAllDenda: () => getAllDenda(),
        getDendaById: (_, { id }) => getDendaById(id)
    },

    Mutation: {
        // createDenda sudah sesuai dengan controller
        createDenda: (_, { id_pengembalian, jumlah_denda, keterangan }) => {
            return createDenda({
                id_pengembalian,
                jumlah_denda,
                keterangan
            });
        },

        // updateDenda sudah sesuai dengan controller
        updateDenda: (_, { id, jumlah_denda, keterangan }) => {
            return updateDenda(id, {
                jumlah_denda,
                keterangan
            });
        },

        // deleteDenda sudah sesuai
        deleteDenda: (_, { id }) => {
            return deleteDenda(id);
        },

        // Mutasi 'updateStatusPembayaran' dihapus seluruhnya karena
        // logikanya sudah tidak ada di DendaController.
    }
};

module.exports = resolvers;
