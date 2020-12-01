var advisers = require('../fixtures/adviser-list.json')
var autoCompleteAdvisers = require('../fixtures/autocomplete-adviser-list.json')
var singleAdviser = require('../fixtures/single-adviser.json')

exports.advisers = function (req, res) {
  if (req.query.autocomplete) {
    return res.json(autoCompleteAdvisers)
  }
  res.json(advisers)
}

exports.singleAdviser = function (req, res) {
  /*
   * Return a single adviser
   *
   * Use the adviser id provided to find the adviser from the autocomplete list
   */
  const pathComponents = req.path.split('/')
  const adviserId = pathComponents[pathComponents.length - 2]
  let adviser = autoCompleteAdvisers.results.find(({ id }) => id === adviserId)
  if (!adviser) {
    adviser = Object.assign({}, singleAdviser)
    adviser.id = adviserId
  }
  res.json(adviser)
}
