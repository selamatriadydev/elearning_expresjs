var connection = require('../library/database');

module.exports = {
    getAllQuestions: function() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM soal_test', (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    // Menyimpan riwayat quiz
    saveQuizHistory: function(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO quiz_history SET ?', data, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    // Mengambil riwayat quiz berdasarkan quiz_id dan user_id
    getQuizHistory: function(quizId, userId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM quiz_history WHERE quiz_id = ? AND user_id = ?',
                [quizId, userId],
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result[0]);
                }
            );
        });
    },   
}

