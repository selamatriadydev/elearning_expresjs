var connection = require('../library/database');

module.exports = {
    getTotalCount : function() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(*) AS total FROM quiz where status ='aktif' and date_finish is null", (err, result) => {
                if (err) {
                    reject(err);  // Reject promise jika ada error
                } else {
                    resolve(result);  // Resolve promise dengan hasil query
                }
            });
        });
    },
    
    getAllData: function(limit, offset) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT quiz.*, COUNT(quiz_soal.quiz_id) as total_soal 
                FROM quiz
                LEFT JOIN quiz_soal ON quiz.id = quiz_soal.quiz_id
                where status ='aktif' and date_finish is null
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
    // Mengambil soal-soal berdasarkan quiz_id
    getSoalByQuizId: function(quizId) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT soal_test.* FROM soal_test 
                 JOIN quiz_soal ON soal_test.id = quiz_soal.soal_id
                 WHERE quiz_soal.quiz_id = ?`, 
                [quizId], 
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    },

    // Menyimpan jawaban quiz pengguna
    saveQuizHistory: function(quizHistory) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO quiz_history SET ?', quizHistory, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    updateQuizFinish: function(id, formData) {
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


    // Mengambil riwayat quiz berdasarkan quiz_id
    getQuizHistory: function(quizId) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT quiz_history.*, soal_test.soal, soal_test.jawaban_benar 
                 FROM quiz_history 
                 JOIN soal_test ON quiz_history.soal_id = soal_test.id
                 WHERE quiz_history.quiz_id = ?`, 
                [quizId], 
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    }
}