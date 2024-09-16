var express = require('express');
var router = express.Router();
var postModel = require('../model/question');
var flashMessage = require('../utils/flashMessage');
var paginate = require('../utils/pagination');

var initialRoute = 'question';
let initialState = {
    soal: '',
    jenis_soal_id: '',
    pilihan_a: '',
    pilihan_b: '',
    pilihan_c: '',
    pilihan_d: '',
    jawaban_benar: '',
    keterangan: '',
};
/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    var headers = [
      {'text': 'Soal', 'value': 'soal'},
      {'text': 'Jenis', 'value': 'jenis'}
    ];
    var actions = {add : true, route:initialRoute, table : {enabled: true, dataId: 'id', route:initialRoute, edit : true, delete : true}};
  
    paginate(req, postModel.getTotalCount, initialRoute, function(err, paginationData) {
      if (err) {
        // handle error
        flashMessage.setFlash(req, 'error', err);
        res.render('questions', {
          actions: actions,
          headers: headers,
          data: '',
          initialRoute
        });
      } else {
        const pagination = paginationData;
        postModel.getAllPosts(pagination.limit, pagination.offset, function(err, rows) {
          if (err) {
            flashMessage.setFlash(req, 'error', err);
            res.render('questions', {
              actions: actions,
              headers: headers,
              data: '',
              initialRoute
            });
          } else {
            res.render('questions/index', {
              actions: actions,
              headers: headers,
              data: rows, // <-- data posts
              initialRoute,
              pagination: pagination
            });
          }
        });
      }
    });
  });

/**
 * CREATE POST
 */
router.get('/create', async function (req, res, next) {
    const jenisSoal = await postModel.getJenisSoal();
    res.render('questions/create', {
        initialRoute : initialRoute,
        jenis_soal: jenisSoal,
        soal: '',
        jenis_soal_id: '',
        pilihan_a: '',
        pilihan_b: '',
        pilihan_c: '',
        pilihan_d: '',
        jawaban_benar: '',
        keterangan: '',
    }) 
})

/**
 * STORE POST
 */
router.post('/store', async function (req, res, next) {
    const jenisSoal = await postModel.getJenisSoal();
    let formData = {
        soal: req.body.soal || initialState.soal,
        jenis_soal_id: req.body.jenis_soal || initialState.jenis_soal_id,
        pilihan_a: req.body.pilihan_a || initialState.pilihan_a,
        pilihan_b: req.body.pilihan_b || initialState.pilihan_b,
        pilihan_c: req.body.pilihan_c || initialState.pilihan_c,
        pilihan_d: req.body.pilihan_d || initialState.pilihan_d,
        jawaban_benar: req.body.jawaban_benar || initialState.jawaban_benar,
        keterangan: req.body.keterangan || initialState.keterangan
    };
    let errors  = false;
    // Validasi
    if (formData.soal.trim().length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Soal");
    }
    
    if (formData.jenis_soal_id.trim().length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Pilih Jenis Soal");
    }
    
    if (errors) {
        res.render('questions/create', {initialRoute : initialRoute,jenis_soal : jenisSoal, ...formData});
    }

    if(!errors) {
        postModel.createPost(formData, function(err, result) {
            if (err) {
                flashMessage.setFlash(req, 'error', err)
                res.render('questions/create', {initialRoute : initialRoute,jenis_soal : jenisSoal, ...formData})
            } else {                
                flashMessage.setFlash(req, 'success', 'Data Berhasil Disimpan!');
                res.redirect('/question');
            }
        })
    }
})

/**
 * EDIT POST
 */
router.get('/edit/(:id)', async function(req, res, next) {
    let id = req.params.id;
    const jenisSoal = await postModel.getJenisSoal();
    postModel.getPostById(id, function(err, rows) {
        if(err) throw err
        if (rows.length <= 0) {
            flashMessage.setFlash(req, 'error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan");
            res.redirect('/question')
        } else {
            res.render('questions/edit', {
                initialRoute : initialRoute,
                jenis_soal : jenisSoal,
                id:      rows[0].id,
                soal: rows[0].soal,
                jenis_soal_id: rows[0].jenis_soal_id,
                pilihan_a: rows[0].pilihan_a,
                pilihan_b: rows[0].pilihan_b,
                pilihan_c: rows[0].pilihan_c,
                pilihan_d: rows[0].pilihan_d,
                jawaban_benar: rows[0].jawaban_benar,
                keterangan: rows[0].keterangan,
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id', async function(req, res, next) {
    let id      = req.params.id;
    let formData = {
        soal: req.body.soal || initialState.soal,
        jenis_soal_id: req.body.jenis_soal || initialState.jenis_soal_id,
        pilihan_a: req.body.pilihan_a || initialState.pilihan_a,
        pilihan_b: req.body.pilihan_b || initialState.pilihan_b,
        pilihan_c: req.body.pilihan_c || initialState.pilihan_c,
        pilihan_d: req.body.pilihan_d || initialState.pilihan_d,
        jawaban_benar: req.body.jawaban_benar || initialState.jawaban_benar,
        keterangan: req.body.keterangan || initialState.keterangan
    };
    let errors  = false;
    const jenisSoal = await postModel.getJenisSoal();

    // Validasi
    if (formData.soal.trim().length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Soal");
    }
    
    if (formData.jenis_soal_id.trim().length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Pilih Jenis Soal");
    }
    
    if (errors) {
        res.render('questions/edit', {initialRoute : initialRoute,jenis_soal : jenisSoal, id:req.params.id, ...formData});
    }

    if( !errors ) {   
        postModel.updatePost(id, formData, function(err, result) {
            if (err) {
                flashMessage.setFlash(req, 'error', err)
                res.render('questions/edit', {initialRoute : initialRoute,jenis_soal : jenisSoal, id:req.params.id, ...formData})
            } else {
                flashMessage.setFlash(req, 'success', 'Data Berhasil Diupdate!');
                res.redirect('/question');
            }
        })
    }
})


/**
 * DELETE POST
 */
router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;
    postModel.deletePost(id, function(err, result) {
        if (err) {
            flashMessage.setFlash(req, 'error', err);
            res.redirect('/question')
        } else {
            flashMessage.setFlash(req, 'success', 'Data Berhasil Dihapus!');
            res.redirect('/question')
        }
    })
})

module.exports = router;