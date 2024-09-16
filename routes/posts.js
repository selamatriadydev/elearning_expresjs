var express = require('express');
var router = express.Router();
var postModel = require('../model/posts');
var flashMessage = require('../utils/flashMessage');
var paginate = require('../utils/pagination');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    var headers = [
      {'text': 'ID', 'value': 'id'},
      {'text': 'Title', 'value': 'title'},
      {'text': 'Content', 'value': 'content'}
    ];
    var actions = {add : true, table : {enabled: true, dataId: 'id', route:'posts', edit : true, delete : true}};
  
    paginate(req, postModel.getTotalCount, 'posts', function(err, paginationData) {
      if (err) {
        // handle error
        flashMessage.setFlash(req, 'error', err);
        res.render('posts', {
          actions: actions,
          headers: headers,
          data: ''
        });
      } else {
        const pagination = paginationData;
        postModel.getAllPosts(pagination.limit, pagination.offset, function(err, rows) {
          if (err) {
            flashMessage.setFlash(req, 'error', err);
            res.render('posts', {
              actions: actions,
              headers: headers,
              data: ''
            });
          } else {
            res.render('posts/index', {
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
    res.render('posts/create', {
        title: '',
        content: ''
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {
    let title   = req.body.title;
    let content = req.body.content;
    let errors  = false;

    if(title.length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Title");
        res.render('posts/create', {
            title: title,
            content: content
        })
    }

    if(content.length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Konten");
        res.render('posts/create', {
            title: title,
            content: content
        })
    }

    if(!errors) {
        let formData = {
            title: title,
            content: content
        }
        postModel.createPost(formData, function(err, result) {
            if (err) {
                flashMessage.setFlash(req, 'error', err)
                res.render('posts/create', {
                    title: formData.title,
                    content: formData.content                    
                })
            } else {                
                flashMessage.setFlash(req, 'success', 'Data Berhasil Disimpan!');
                res.redirect('/posts');
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
            res.redirect('/posts')
        } else {
            res.render('posts/edit', {
                id:      rows[0].id,
                title:   rows[0].title,
                content: rows[0].content
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id', function(req, res, next) {
    let id      = req.params.id;
    let title   = req.body.title;
    let content = req.body.content;
    let errors  = false;

    if(title.length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Title");
        res.render('posts/edit', {
            id:         req.params.id,
            title:      title,
            content:    content
        })
    }

    if(content.length === 0) {
        errors = true;
        flashMessage.setFlash(req, 'error', "Silahkan Masukkan Konten");
        res.render('posts/edit', {
            id:         req.params.id,
            title:      title,
            content:    content
        })
    }

    if( !errors ) {   
        let formData = {
            title: title,
            content: content
        }
        postModel.updatePost(id, formData, function(err, result) {
            if (err) {
                flashMessage.setFlash(req, 'error', err)
                res.render('posts/edit', {
                    id:     req.params.id,
                    title:   formData.title,
                    content: formData.content
                })
            } else {
                flashMessage.setFlash(req, 'success', 'Data Berhasil Diupdate!');
                res.redirect('/posts');
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
            res.redirect('/posts')
        } else {
            flashMessage.setFlash(req, 'success', 'Data Berhasil Dihapus!');
            res.redirect('/posts')
        }
    })
})

module.exports = router;