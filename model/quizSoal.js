var connection = require('../library/database');

// models/postModel.js
module.exports = {
    // Mengambil soal-soal yang sudah ada dalam quiz
    getSoalByQuizId: function(quizId) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT soal_test.* FROM soal_test 
                 JOIN quiz_soal ON soal_test.id = quiz_soal.soal_id
                 WHERE quiz_soal.quiz_id = ? order by soal_test.id asc`, 
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

    // Mengambil soal yang belum ada dalam quiz untuk ditambahkan
    getQuizGroup: function(quizId) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT * FROM quiz WHERE id != ?`, 
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
    getAvailableSoalForQuiz: function(quizId) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT * FROM soal_test 
                 WHERE id NOT IN (SELECT soal_id FROM quiz_soal WHERE quiz_id = ?)`, 
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

    // Menambahkan soal ke quiz
    addSoalToQuiz: function(quizId, soalId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO quiz_soal (quiz_id, soal_id) VALUES (?, ?)', 
                [quizId, soalId], 
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    },

    // Menghapus soal dari quiz
    removeSoalFromQuiz: function(quizId, soalId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM quiz_soal WHERE quiz_id = ? AND soal_id = ?', 
                [quizId, soalId], 
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    }
};
