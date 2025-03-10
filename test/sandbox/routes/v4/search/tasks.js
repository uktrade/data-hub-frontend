import myTasks from '../../../fixtures/v4/search/myTasks.json' with { type: 'json' }

export const tasks = function (req, res) {
  return res.json(myTasks)
}
