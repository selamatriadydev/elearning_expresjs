var express = require('express');
var router = express.Router();
var postModel = require('../model/quizHistory');
var flashMessage = require('../utils/flashMessage');
var paginate = require('../utils/promisePaginate');

var initialRoute = 'quiz_history';
/**
 * INDEX POSTS
 */
router.get('/', async function (req, res, next) {
    var headers = [
        {'text': 'title', 'value': 'title'},
        {'text': 'Jumlah Soal', 'value': 'total_soal'},
        {'text': 'Jumlah benar', 'value': 'jumlah_benar'},
        {'text': 'Nilai', 'value': 'nilai'},
        {'text': 'Selesai', 'value': 'date_history'},
      ];
    var actions = {add : false, route:initialRoute, table : {enabled: true, dataId: 'id', route:initialRoute, history : true}};
    try{
        const pagination = await paginate(req, postModel.getTotalCount, initialRoute);
        const data = await postModel.getAllData(pagination.limit, pagination.offset); // Ambil semua soal
        res.render('quiz', { initialRoute,headers,actions, pagination, data });
    }catch (err){
        flashMessage.setFlash(req, 'error', err)
        res.render('quiz', { initialRoute,headers,actions, pagination:'', data : '' });
    }
});
// Route untuk menampilkan hasil quiz
router.get('/:quizId/history', async (req, res) => {
    const quizId = req.params.quizId;

    try {
        // Ambil riwayat quiz pengguna dari quiz_history
        const quizHistory = await postModel.getQuizHistory(quizId);

        res.render('quiz/history', {
            initialRoute,
            quizId,
            quizHistory
        });
    } catch (err) {
        flashMessage.setFlash(req, 'error',err);
        res.redirect(`/${initialRoute}`);
    }
});

module.exports = router;