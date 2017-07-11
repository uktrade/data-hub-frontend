function getHandler (req, res, next) {
  res.render(templatePath, templateData)
}

function postHandler (req, res, next) {

}

module.exports = {
  getHandler,
  postHandler,
}
