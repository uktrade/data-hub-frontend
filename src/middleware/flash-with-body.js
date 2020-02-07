module.exports = (req, res, next) => {
  req.flashWithBody = (type, heading, body) => {
    req.flash(`${type}:with-body`, JSON.stringify({ heading, body }))
  }
  next()
}
