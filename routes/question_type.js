var express = require('express');
var router = express.Router();
var postModel = require('../model/question_type');
var flashMessage = require('../utils/flashMessage');
var paginate = require('../utils/pagination');

var initialRoute = 'question_type';
/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    var headers = [
      {'text': 'Jenis', 'value': 'jenis'},
      {'text': 'Status', 'value': 'status'}
    ];
    var actions = {add : true, route:'question_type', table : {enabled: true, dataId: 'id', route:'question_type', edit : true, delete : true}};
  
    paginate(req, postModel.getTotalCount, 'question_type', function(err, paginationData) {
      if (err) {
        // handle error
        flashMessage.setFlash(req, 'error', err);
        res.render('questionsType', {
            initialRoute,
          actions: actions,
          headers: headers,
          data: ''
        });
      } else {
        const pagination = paginationData;
        postModel.getAllPosts(pagination.limit, pagination.offset, function(err, rows) {
          if (err) {
            flashMessage.setFlash(req, 'error', err);
            res.render('questionsType', {
                initialRoute,
              actions: actions,
              headers: headers,
              data: ''
            });
          } else {
            res.render('questionsType/index', {
                initialRoute,
              actions: actions,
              headers: headers,
              data: rows, // <-- data posts
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
router.get('/create', function (req, res, next) {
    res.render('questionsType/create', {
        initialRoute : initialRoute,
        jenis: '',
        status: ''
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {
    let jenis   = req.body.jenis;
    let status = req.body.status;
    let errors  = false;

    if(jenis.length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Title");
        res.render('questionsType/create', {
            jenis: jenis,
            status: status
        })
    }

    if(status.length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Konten");
        res.render('questionsType/create', {
            jenis: jenis,
            status: status
        })
    }

    if(!errors) {
        let formData = {
            jenis: jenis,
            status: status
        }
        postModel.createPost(formData, function(err, result) {
            if (err) {
                flashMessage.setFlash(req, 'error', err)
                res.render('questionsType/create', {
                    jenis: formData.jenis,
                    jenis: formData.jenis                    
                })
            } else {                
                flashMessage.setFlash(req, 'success', 'Data Berhasil Disimpan!');
                res.redirect('/question_type');
            }
        })
    }
})

/**
 * EDIT POST
 */
router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    postModel.getPostById(id, function(err, rows) {
        if(err) throw err
        if (rows.length <= 0) {
            flashMessage.setFlash(req, 'error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan");
            res.redirect('/question_type')
        } else {
            res.render('questionsType/edit', {
                initialRoute : initialRoute,
                id:      rows[0].id,
                jenis:   rows[0].jenis,
                status: rows[0].status
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id', function(req, res, next) {
    let id      = req.params.id;
    let jenis   = req.body.jenis;
    let status = req.body.status;
    let errors  = false;

    if(jenis.length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Jenis");
        res.render('questionsType/edit', {
            id:         req.params.id,
            title:      title,
            status:    status
        })
    }

    if(status.length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Status");
        res.render('questionsType/edit', {
            id:         req.params.id,
            jenis:      jenis,
            status:    status
        })
    }

    if( !errors ) {   
        let formData = {
            jenis: jenis,
            status: status
        }
        postModel.updatePost(id, formData, function(err, result) {
            if (err) {
                flashMessage.setFlash(req, 'error', err)
                res.render('questionsType/edit', {
                    id:     req.params.id,
                    jenis:   formData.jenis,
                    status: formData.status
                })
            } else {
                flashMessage.setFlash(req, 'success', 'Data Berhasil Diupdate!');
                res.redirect('/question_type');
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
            res.redirect('/question_type')
        } else {
            flashMessage.setFlash(req, 'success', 'Data Berhasil Dihapus!');
            res.redirect('/question_type')
        }
    })
})

module.exports = router;