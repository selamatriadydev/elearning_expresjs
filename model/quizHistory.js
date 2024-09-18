var connection = require('../library/database');

module.exports = {
    getTotalCount : function() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(*) AS total FROM quiz where status ='aktif' and date_finish is not null", (err, result) => {
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
                SELECT quiz.*, COUNT(quiz_soal.quiz_id) as total_soal, 
                DATE_FORMAT(quiz.date_finish, '%Y-%m-%d %H:%i') AS date_history,
                (SELECT
                        COUNT(*)
                    FROM
                        quiz_history
                        JOIN soal_test ON soal_test.id = quiz_history.soal_id
                    WHERE
                        quiz_history.quiz_id = quiz.id
                        AND quiz_history.quiz_jawaban = soal_test.jawaban_benar
                ) AS jumlah_benar,
                 ( 
                    (SELECT  COUNT(*) FROM quiz_history JOIN soal_test ON soal_test.id = quiz_history.soal_id WHERE quiz_history.quiz_id = quiz.id AND quiz_history.quiz_jawaban = soal_test.jawaban_benar)
                     / COUNT(quiz_soal.quiz_id)) * 100 
                AS nilai
                        
                FROM quiz
                LEFT JOIN quiz_soal ON quiz.id = quiz_soal.quiz_id
                where status ='aktif' and date_finish is not null
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


    // Mengambil riwayat quiz berdasarkan quiz_id
    getQuizHistory: function(quizId) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT quiz_history.*,  soal_test.soal, soal_test.pilihan_a, soal_test.pilihan_b, soal_test.pilihan_c, soal_test.pilihan_d, soal_test.jawaban_benar, soal_test.keterangan
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