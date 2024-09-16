var connection = require('../library/database');

module.exports = {
    getTotalCount : function(callback) {
        connection.query('SELECT COUNT(*) AS total FROM posts', callback);
    },
    
    getAllPosts: function(limit, offset, callback) {
        connection.query(`SELECT * FROM posts ORDER BY id desc LIMIT ? OFFSET ?`, [limit, offset], callback);
    },
    // getAllPosts: function(callback) {
    //     connection.query('SELECT * FROM posts ORDER BY id desc', callback);
    // },

    createPost: function(formData, callback) {
        connection.query('INSERT INTO posts SET ?', formData, callback);
    },

    getPostById: function(id, callback) {
        connection.query('SELECT * FROM posts WHERE id = ' + id, callback);
    },

    updatePost: function(id, formData, callback) {
        connection.query('UPDATE posts SET ? WHERE id = ' + id, formData, callback);
    },

    deletePost: function(id, callback) {
        connection.query('DELETE FROM posts WHERE id = ' + id, callback);
    }
}