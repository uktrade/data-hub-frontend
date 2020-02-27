module.exports = (req, res, next) => {
  req.flashWithBody = (type, heading, body, id) => {
    req.flash(`${type}:with-body`, JSON.stringify({ heading, body, id }))
  }
  next()
}
