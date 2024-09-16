var express = require('express');
var router = express.Router();
var postModel = require('../model/quizSoal');
var flashMessage = require('../utils/flashMessage');
var paginate = require('../utils/promisePaginate');

var initialRoute = 'quiz_soal';
let initialState = {
    quiz_id: '',
    soal_id: '',
};
/**
 * INDEX POSTS
 */
// Route untuk menampilkan daftar soal dalam quiz
router.get('/:quizId/soal', async (req, res) => {
    const quizId = req.params.quizId;

    try {
        // Ambil soal-soal yang sudah terkait dengan quiz
        const quizs = await postModel.getQuizGroup(quizId);
        const quizSoal = await postModel.getSoalByQuizId(quizId);

        // Ambil semua soal yang belum ada dalam quiz untuk ditambahkan
        const availableSoal = await postModel.getAvailableSoalForQuiz(quizId);

        res.render('quiz/groupSoal', {
            initialRoute:initialRoute,
            quizId: quizId,
            quizsGroup: quizs,
            quizSoal: quizSoal,
            availableSoal: availableSoal
        });
    } catch (err) {
        flashMessage.setFlash(req, 'error', "Tidak ada data");
        res.redirect(`/${initialRoute}`);
    }
});
// Route untuk menambahkan soal ke quiz
router.post('/:quizId/soal/add', async (req, res) => {
    const quizId = req.params.quizId;
    const soalId = req.body.soal_id;

    try {
        await postModel.addSoalToQuiz(quizId, soalId);
        res.redirect(`/${initialRoute}/${quizId}/soal`);
    } catch (err) {
        flashMessage.setFlash(req, 'error', err);
        res.redirect(`/${initialRoute}`);
    }
});

// Route untuk menghapus soal dari quiz
router.get('/:quizId/soal/remove/:soalId', async (req, res) => {
    const quizId = req.params.quizId;
    const soalId = req.params.soalId;

    try {
        await postModel.removeSoalFromQuiz(quizId, soalId);
        res.redirect(`/${initialRoute}/${quizId}/soal`);
    } catch (err) {
        flashMessage.setFlash(req, 'error', err);
        res.redirect(`/${initialRoute}`);
    }
});


module.exports = router;