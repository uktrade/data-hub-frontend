// req must be request not request-promise
function streamToFile (req, res, filename, type = 'txt') {
  res.attachment(filename)
  res.type(type)
  req.pipe(res)
  return req
}

module.exports = {
  streamToFile,
}
