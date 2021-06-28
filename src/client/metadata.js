import axios from 'axios'

const HQ_TYPE_LABELS = {
  ukhq: 'UK HQ',
  ghq: 'Global HQ',
  ehq: 'European HQ',
}

const filterDisabledOption = ({ disabled_on }) =>
  disabled_on ? Date.parse(disabled_on) > Date.now() : true

const transformMetadataOption = ({ id, name }) => ({
  value: id,
  label: name,
})

/**
 * Get a filtered list of metadata options
 * @url the metadata endpoint
 * @filterDisabled whether to filter each option based on its
 * disabled_on key, defaulting to true
 */
async function getMetadataOptions(url, { filterDisabled = true } = {}) {
  const { data } = await axios.get(url)

  return filterDisabled
    ? data.filter(filterDisabledOption).map(transformMetadataOption)
    : data.map(transformMetadataOption)
}

/**
 * Get the hq type options as a list of values and labels
 */
const getHeadquarterTypeOptions = (url) =>
  getMetadataOptions(url).then((items) =>
    items
      .map(({ value, label }) => ({
        value,
        label: HQ_TYPE_LABELS[label] || label,
      }))
      .sort((item1, item2) => (item1.label > item2.label ? 1 : -1))
  )

/**
 * Get the top-level sector options as a list of values and labels
 *
 * Specifying a searchString uses the autocomplete feature to only show
 * matching results.
 */
const getSectorOptions = (url, searchString) =>
  axios
    .get(url, {
      params: searchString ? { autocomplete: searchString } : {},
    })
    .then(({ data }) =>
      data
        .filter(({ level }) => level === 0)
        .map(({ id, name }) => ({ value: id, label: name }))
    )

export { getMetadataOptions, getHeadquarterTypeOptions, getSectorOptions }
