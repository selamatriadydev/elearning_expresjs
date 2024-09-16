var connection = require('../library/database');

module.exports = {
    getTotalCount : function() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(*) AS total FROM quiz", (err, result) => {
                if (err) {
                    reject(err);  // Reject promise jika ada error
                } else {
                    resolve(result);  // Resolve promise dengan hasil query
                }
            });
        });
    },
    
    getAllPosts: function(limit, offset) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT quiz.*, COUNT(quiz_soal.quiz_id) as total_soal, 
                CASE 
                    WHEN MAX(quiz.date_finish) IS NOT NULL THEN 'Sudah'
                    ELSE 'Belum'
                END AS status_kerjakan
                FROM quiz
                LEFT JOIN quiz_soal ON quiz.id = quiz_soal.quiz_id
                GROUP BY quiz.id
                ORDER BY quiz.id DESC
                LIMIT ? OFFSET ?
            `;
            
            connection.query(query, [limit, offset], (err, result) => {
                if (err) {
                    reject(err);  // Reject promise jika ada error
                } else {
                    resolve(result);  // Resolve promise dengan hasil query
                }
            });
        });
    },
    

    createPost: function(formData) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO quiz SET ?', formData, (err, result) => {
                if (err) {
                    reject(err);  // Reject promise jika ada error
                } else {
                    resolve(result);  // Resolve promise dengan hasil query
                }
            });
        });
    },

    getPostById: function(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM quiz WHERE id = ?', [id], (err, result) => {
                if (err) {
                    reject(err);  // Reject promise jika ada error
                } else {
                    resolve(result);  // Resolve promise dengan hasil query
                }
            });
        });
    },

    updatePost: function(id, formData) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE quiz SET ? WHERE id = ?', [formData,id], (err, result) => {
                if (err) {
                    reject(err);  // Reject promise jika ada error
                } else {
                    resolve(result);  // Resolve promise dengan hasil query
                }
            });
        });
    },

    deletePost: function(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM quiz WHERE id = ? ', [id], (err, result) => {
                if (err) {
                    reject(err);  // Reject promise jika ada error
                } else {
                    resolve(result);  // Resolve promise dengan hasil query
                }
            });
        });
    }
}