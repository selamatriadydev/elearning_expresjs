function promisePaginate(req, model, route) {
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    return new Promise((resolve, reject) => {
      model()
        .then((count) => {
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
            baseUrl: `/${route}`,
          };
  
          resolve(paginationData);
        })
        .catch((err) => reject(err));
    });
  }
  
  module.exports = promisePaginate;
  