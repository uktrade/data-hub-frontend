module.exports = (req, res, next) => {
  const postcode = req.body.uk_postcode
  req.body.uk_postcode = postcode && postcode.split(',')
  next()
}
