var connection = require('../library/database');

module.exports = {
    getTotalCount : function(callback) {
        connection.query('SELECT COUNT(*) AS total FROM soal_test', callback);
    },
    
    getAllPosts: function(limit, offset, callback) {
        connection.query(`SELECT soal_test.*, jenis_soal.jenis FROM soal_test join jenis_soal on jenis_soal.id=soal_test.jenis_soal_id  ORDER BY id asc LIMIT ? OFFSET ?`, [limit, offset], callback);
    },
    getJenisSoal: function() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM jenis_soal WHERE status='aktif' ORDER BY jenis DESC", (err, result) => {
                if (err) {
                    reject(err);  // Reject promise jika ada error
                } else {
                    resolve(result);  // Resolve promise dengan hasil query
                }
            });
        });
    },
    

    createPost: function(formData, callback) {
        connection.query('INSERT INTO soal_test SET ?', formData, callback);
    },

    getPostById: function(id, callback) {
        connection.query('SELECT * FROM soal_test WHERE id = ?', [id], callback);
    },

    updatePost: function(id, formData, callback) {
        connection.query('UPDATE soal_test SET ? WHERE id = ?', [formData,id], callback);
    },

    deletePost: function(id, callback) {
        connection.query('DELETE FROM soal_test WHERE id = ? ', [id], callback);
    }
}