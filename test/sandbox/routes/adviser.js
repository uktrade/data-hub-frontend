import advisersListJson from '../fixtures/adviser-list.json' assert { type: 'json' }
import autoCompleteAdvisers from '../fixtures/autocomplete-adviser-list.json' assert { type: 'json' }
import singleAdviserJson from '../fixtures/single-adviser.json' assert { type: 'json' }

export const advisers = function (req, res) {
  if (req.query.autocomplete) {
    return res.json(autoCompleteAdvisers)
  }
  res.json(advisersListJson)
}

/**
 * Return a single adviser
 *
 * Use the adviser id provided to find the adviser from the autocomplete list
 */
export const singleAdviser = function (req, res) {
  const pathComponents = req.path.split('/')
  const adviserId = pathComponents[pathComponents.length - 2]
  let adviser = autoCompleteAdvisers.results.find(({ id }) => id === adviserId)
  if (!adviser) {
    adviser = advisersListJson.results.find(({ id }) => id === adviserId)
    if (!adviser) {
      adviser = { ...singleAdviserJson, id: adviserId }
    }
  }
  res.json(adviser)
}
