//pagination.js
function paginate(req, model, route, callback) {
  const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit; 
  model(function(err, count) {
    if (err) {
      callback(err);
    } else {
      const totalCount = count[0].total;
      const currentPage = page;

      const paginationData = {
        limit,
        offset,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage,
        prev: offset - limit >= 0 ? `/${route}?page=${currentPage - 1}` : null,
        next: offset + limit < totalCount ? `/${route}?page=${currentPage + 1}` : null,
        baseUrl: `/${route}`
      };

      callback(null, paginationData);
    }
  });
}

module.exports = paginate;