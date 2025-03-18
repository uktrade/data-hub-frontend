import advisersList from '../fixtures/adviser-list.json' with { type: 'json' }
import autoCompleteAdvisers from '../fixtures/autocomplete-adviser-list.json' with { type: 'json' }
import singleAdviser from '../fixtures/single-adviser.json' with { type: 'json' }

export const advisers = function (req, res) {
  if (req.query.autocomplete) {
    return res.json(autoCompleteAdvisers)
  }
  res.json(advisersList)
}

/**
 * Return a single adviser
 *
 * Use the adviser id provided to find the adviser from the autocomplete list
 */
export const adviser = function (req, res) {
  const pathComponents = req.path.split('/')
  const adviserId = pathComponents[pathComponents.length - 2]
  let adviser = autoCompleteAdvisers.results.find(({ id }) => id === adviserId)
  if (!adviser) {
    adviser = advisersList.results.find(({ id }) => id === adviserId)
    if (!adviser) {
      adviser = { ...singleAdviser, id: adviserId }
    }
  }
  res.json(adviser)
}
