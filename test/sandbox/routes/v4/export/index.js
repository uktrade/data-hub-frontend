const { faker } = require('@faker-js/faker')
const { generateExports } = require('./exports')

exports.getExportItems = function (req, res) {
  return res.json(generateExports())
}

exports.getExportItem = function (req, res) {
  return res.json(generateExports()[0])
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
