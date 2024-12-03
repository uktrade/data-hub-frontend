import {
  generateTask,
  generateTasks,
  generateCompaniesAndProjects,
} from './tasks.js'
import { faker } from '../../../utils.js'

export const getTasks = function (req, res) {
  res.json(generateTasks())
}

export const getTask = function (req, res) {
  res.json(
    generateTask({
      id: req.params.taskId,
    })
  )
}

export const createTask = function (req, res) {
  res.status(201).json({ ...req.body, id: faker.string.uuid() })
}

export const updateTask = function (req, res) {
  res.status(200).json({ ...req.body })
}

export const investmentProjectTasks = function (req, res) {
  res.json({ count: 0, next: null, previous: null, results: [] })
}

export const getTaskCompaniesAndProjects = function (req, res) {
  res.json(generateCompaniesAndProjects())
}
