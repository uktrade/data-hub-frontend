module.exports = () => {
  return function titleMiddleware (req, res, next) {
    res.title = function title (title) {
      res.locals.title = title
      return this
    }
    next()
  }
}
