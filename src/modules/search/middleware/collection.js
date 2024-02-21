const { exportSearch } = require('../services')

function exportCollection(searchEntity) {
  return async function (req, res, next) {
    return exportSearch({
      searchEntity,
      requestBody: req.body,
      req,
    })
      .then((apiReq) => {
        res.set('Content-Type', apiReq.headers['content-type'])
        res.set('Content-Disposition', apiReq.headers['content-disposition'])
        return apiReq.data.pipe(res)
      })
      .catch((error) => {
        return next(error)
      })
  }
}

module.exports = {
  exportCollection,
}
