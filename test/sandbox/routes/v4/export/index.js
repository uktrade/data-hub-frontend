const { faker } = require('@faker-js/faker')
const { exportItems } = require('./exports')

exports.getExportItems = function (req, res) {
  return res.json(exportItems)
}

exports.getExportItem = function (req, res) {
  const exportItem = exportItems.results.find(
    (x) => x.id == req.params.exportId
  )
  return exportItem ? res.json(exportItem) : res.sendStatus(404)
}

exports.createExportItem = function (req, res) {
  return res.json({ ...req.body, id: faker.datatype.uuid() })
}

exports.updateExportItem = function (req, res) {
  return res.json(req.body)
}

exports.deleteExportItem = function (req, res) {
  res.sendStatus(204)
}
