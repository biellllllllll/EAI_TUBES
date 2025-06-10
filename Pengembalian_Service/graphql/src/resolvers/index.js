const {
    getAllPengembalian,
    getPengembalianById,
    createPengembalian,
    updatePengembalian,
    deletePengembalian
} = require('../data/pengembalian');

const resolvers = {
    Query: {
        getAllPengembalian: () => getAllPengembalian(),
        getPengembalianById: (_, { id }) => getPengembalianById(id)
    },

    Mutation: {
        createPengembalian: (_, { peminjaman_id, tanggal_pengembalian }) => {
            try {
                return createPengembalian({
                    peminjaman_id,
                    tanggal_pengembalian
                });
            } catch (error) {
                throw new Error(error.message);
            }
        },

        updatePengembalian: (_, { id, peminjaman_id, tanggal_pengembalian }) => {
            return updatePengembalian(id, {
                peminjaman_id,
                tanggal_pengembalian
            });
        },

        deletePengembalian: (_, { id }) => {
            return deletePengembalian(id);
        }
    }
};

module.exports = resolvers; 