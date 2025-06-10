const {
    getAllPengembalian,
    getPengembalianById,
    createPengembalian,
    updatePengembalian,
    deletePengembalian
} = require('../data/pengembalian');

const resolvers = {
    Query: {
        // Tidak ada perubahan, query tetap sama
        getAllPengembalian: () => getAllPengembalian(),
        getPengembalianById: (_, { id }) => getPengembalianById(id)
    },

    Mutation: {
        /**
         * Sesuai dengan controller, kita hanya butuh peminjaman_id.
         * Tanggal pengembalian dan status akan di-handle oleh logika bisnis
         * di dalam fungsi createPengembalian (yang seharusnya meniru logika controller).
         */
        createPengembalian: (_, { peminjaman_id }) => {
            try {
                // Hanya meneruskan peminjaman_id
                return createPengembalian({ peminjaman_id });
            } catch (error) {
                // Melempar error agar bisa ditangkap oleh GraphQL
                throw new Error(error.message);
            }
        },

        /**
         * Sesuai dengan controller, kita bisa mengupdate tanggal_pengembalian dan status.
         * peminjaman_id tidak diubah.
         */
        updatePengembalian: (_, { id, tanggal_pengembalian, status }) => {
            // Meneruskan field yang bisa diubah ke dalam satu objek
            const input = {
                tanggal_pengembalian,
                status
            };
            return updatePengembalian(id, input);
        },

        // Tidak ada perubahan, delete tetap berdasarkan ID
        deletePengembalian: (_, { id }) => {
            return deletePengembalian(id);
        }
    }
};

module.exports = resolvers;
