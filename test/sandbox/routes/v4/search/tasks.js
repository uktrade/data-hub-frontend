import myTasks from '../../../fixtures/v4/search/myTasks.json' assert { type: 'json' }

export const tasks = function (req, res) {
  return res.json(myTasks)
}
