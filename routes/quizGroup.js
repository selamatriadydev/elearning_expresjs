var express = require('express');
var router = express.Router();
var postModel = require('../model/quizGroup');
var flashMessage = require('../utils/flashMessage');
var paginate = require('../utils/promisePaginate');

var initialRoute = 'quiz_group';
let initialState = {
    title: '',
    status: 'nonaktif',
};
/**
 * INDEX POSTS
 */
router.get('/', async function (req, res, next) {
    var headers = [
        {'text': 'title', 'value': 'title'},
        {'text': 'Status', 'value': 'status'},
        {'text': 'Kerjakan', 'value': 'status_kerjakan'},
        {'text': 'Soal', 'value': 'total_soal', link : true, uri: 'quiz_soal',uriLast: 'soal', uriId: 'id'},
      ];
    var actions = {add : true, route:initialRoute, table : {enabled: true, dataId: 'id', route:initialRoute, valueDisabled: 'status_kerjakan', setValueDisabled: 'Belum', edit : true, delete : true}};
    try{
        const pagination = await paginate(req, postModel.getTotalCount, initialRoute);
        const data = await postModel.getAllPosts(pagination.limit, pagination.offset); // Ambil semua soal
        res.render('quiz/group', { initialRoute,headers,actions, pagination, data });
    }catch {
        res.render('quiz/group', { initialRoute,headers,actions, pagination:'', data : '' });
    }
});
router.get('/create', function (req, res, next) {
    res.render('quiz/group/create', {
        initialRoute : initialRoute,
        ...initialState
    }) 
})
router.post('/store', async function(req, res) {
    let formData = {
        title: req.body.title || initialState.title,
        status: req.body.status || initialState.status
    };
    let errors  = false;
    // Validasi
    if (formData.title.trim().length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Judul");
    }
    
    if (formData.status.trim().length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Pilih Status");
    }
    
    if (errors) {
        res.render('quiz/group/create', {initialRoute : initialRoute, ...formData});
    }
    try{
        const newdata = await postModel.createPost(formData);
        flashMessage.setFlash(req, 'success', 'Data Berhasil Disimpan!');
        res.redirect(`/${initialRoute}`);
    }catch (err){
        flashMessage.setFlash(req, 'error', err)
        res.render('quiz/group/create', {initialRoute : initialRoute, ...formData});
    }
}); 
router.get('/edit/(:id)', async function(req, res, next) {
    let id = req.params.id;
    try {
        const getdata = await postModel.getPostById(id);
        
        if (!getdata || getdata.length === 0) {
            // If no data is found
            flashMessage.setFlash(req, 'error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan");
            return res.redirect(`/${initialRoute}`);
        }

        const data = {
            id: getdata[0].id,
            title: getdata[0].title,
            status: getdata[0].status,
        };
        
        res.render('quiz/group/edit', {
            initialRoute: initialRoute,
            ...data
        });
    } catch (err) {
        flashMessage.setFlash(req, 'error', 'Error: ' + err.message); // Capture specific error message
        res.redirect(`/${initialRoute}`);
    }
});

router.post('/update/:id', async function(req, res) {
    let id      = req.params.id;
    let formData = {
        title: req.body.title || initialState.title,
        status: req.body.status || initialState.status
    };
    let errors  = false;
    // Validasi
    if (formData.title.trim().length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Judul");
    }
    
    if (formData.status.trim().length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Pilih Status");
    }
    
    if (errors) {
        res.render('quiz/group/create', {initialRoute : initialRoute, ...formData});
    }
    try{
        const updatedata = await postModel.updatePost(id,formData);
        flashMessage.setFlash(req, 'success', 'Data Berhasil Disimpan!');
        res.redirect(`/${initialRoute}`);
    }catch{
        flashMessage.setFlash(req, 'error', err)
        res.render('quiz/group/create', {initialRoute : initialRoute, ...formData});
    }
}); 
router.get('/delete/(:id)', async function(req, res, next) {
    let id = req.params.id;
    try{
        const deletedata = await postModel.deletePost(id);
        flashMessage.setFlash(req, 'success', 'Data Berhasil Dihapus!');
        res.redirect(`/${initialRoute}`);
    }catch{
        flashMessage.setFlash(req, 'error', 'Data gagal Dihapus!');
        res.redirect(`/${initialRoute}`);
    }
})

module.exports = router;