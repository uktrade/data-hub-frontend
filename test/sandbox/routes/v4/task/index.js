const { faker } = require('@faker-js/faker')
const { generateTasks } = require('./tasks')

exports.getTasks = function (req, res) {
  res.json(generateTasks())
}

exports.getTask = function (req, res) {
  res.json(generateTasks().results[0])
}

exports.createTask = function (req, res) {
  res.status(201).json({ ...req.body, id: faker.string.uuid() })
}

exports.updateTask = function (req, res) {
  res.status(200).json({ ...req.body })
}
