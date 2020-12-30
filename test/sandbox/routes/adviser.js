var advisers = require('../fixtures/adviser-list.json')
var autoCompleteAdvisor = require('../fixtures/autocomplete-adviser-list.json')
var singleAdviser = require('../fixtures/single-adviser.json')

exports.advisers = function (req, res) {
  if (req.query.autocomplete) {
    return res.json(autoCompleteAdvisor)
  }
  res.json(advisers)
}

exports.singleAdviser = function (req, res) {
  const pathComponents = req.path.split('/')
  const adviserId = pathComponents[pathComponents.length - 2]

  let adviser = autoCompleteAdvisor.results.find(({ id }) => id === adviserId)
  if (!adviser) {
    adviser = { ...singleAdviser, id: adviserId }
  }
  res.json(adviser)
}
