const { faker } = require('@faker-js/faker')
const { generateTask, generateTasks } = require('./tasks')

exports.getTasks = function (req, res) {
  res.json(generateTasks())
}

exports.getTask = function (req, res) {
  res.json(
    generateTask({
      id: req.params.taskId,
    })
  )
}

exports.createTask = function (req, res) {
  res.status(201).json({ ...req.body, id: faker.string.uuid() })
}

exports.updateTask = function (req, res) {
  res.status(200).json({ ...req.body })
}
