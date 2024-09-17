var express = require('express');
var router = express.Router();
var postModel = require('../model/quiz');
var flashMessage = require('../utils/flashMessage');
var paginate = require('../utils/promisePaginate');

var initialRoute = 'quiz';
/**
 * INDEX POSTS
 */
router.get('/', async function (req, res, next) {
    var headers = [
        {'text': 'title', 'value': 'title'},
        {'text': 'Soal', 'value': 'total_soal'},
      ];
    var actions = {add : false, route:initialRoute, table : {enabled: true, dataId: 'id', route:initialRoute, kerjakan : true}};
    try{
        const pagination = await paginate(req, postModel.getTotalCount, initialRoute);
        const data = await postModel.getAllData(pagination.limit, pagination.offset); // Ambil semua soal
        res.render('quiz', { initialRoute,headers,actions, pagination, data });
    }catch (err){
        flashMessage.setFlash(req, 'error', err)
        res.render('quiz', { initialRoute,headers,actions, pagination:'', data : '' });
    }
});
router.get('/:quizId/kerjakan', async (req, res) => {
    const quizId = req.params.quizId;

    try {
        // Ambil soal-soal yang sudah terkait dengan quiz
        const quizSoal = await postModel.getSoalByQuizId(quizId);

        res.render('quiz/soal', {
            initialRoute:initialRoute,
            quizId: quizId,
            quizSoal: quizSoal,
            quiz_jawaban: {}
        });
    } catch (err) {
        flashMessage.setFlash(req, 'error', "Tidak ada data");
        res.redirect(`/${initialRoute}`);
    }
});
// Route untuk menyimpan jawaban quiz
router.post('/:quizId/submit', async (req, res) => {
    const quizId = req.params.quizId;
    const quiz_jawaban = req.body.jawaban; // jawaban dari form
    const soal_jawaban_id = req.body.soal_id; // jawaban dari form
    const soal_jumlah_waktu = req.body.jumlah_waktu_soal; // waktu yang dihabiskan pengguna
    const quiz_jumlah_waktu = req.body.jumlah_waktu; // waktu yang dihabiskan pengguna

    // Simpan jawaban ke dalam quiz_history
    try {
        for (let soalId in quiz_jawaban) {
            const quizHistory = {
                user_id: 1,
                quiz_id: quizId,
                soal_id: soal_jawaban_id[soalId],
                quiz_jawaban: quiz_jawaban[soalId],
                quiz_jawaban_benar: '',
                quiz_jumlah_waktu: soal_jumlah_waktu[soalId],
                quiz_date: new Date()
            };
            await postModel.saveQuizHistory(quizHistory);
        }
        await postModel.updateQuizFinish(quizId, {date_finish: new Date(), jumlah_waktu : quiz_jumlah_waktu});
        // Redirect ke halaman hasil quiz atau ringkasan
        res.redirect(`/quiz_history/${quizId}/history`);
    } catch (err) {
        flashMessage.setFlash(req, 'error', "Tidak ada data");
        res.redirect(`/${initialRoute}`);
    }
});
// Route untuk menampilkan hasil quiz
router.get('/:quizId/result', async (req, res) => {
    const quizId = req.params.quizId;

    try {
        // Ambil riwayat quiz pengguna dari quiz_history
        const quizHistory = await postModel.getQuizHistory(quizId);

        res.render('quiz/result', {
            quizId,
            quizHistory
        });
    } catch (err) {
        flashMessage.setFlash(req, 'error',err);
        res.redirect(`/${initialRoute}`);
    }
});

module.exports = router;