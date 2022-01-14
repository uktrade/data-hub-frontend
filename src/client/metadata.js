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
async function getMetadataOptions(
  url,
  { filterDisabled = true, params = {} } = {}
) {
  const { data } = await axios.get(url, {
    params,
  })
  return filterDisabled
    ? data.filter(filterDisabledOption).map(transformMetadataOption)
    : data.map(transformMetadataOption)
}

async function getMetadataWithContextOptions(
  url,
  context,
  { filterDisabled = true, params = {} } = {}
) {
  const { data } = await axios.get(url, {
    params,
  })
  const filteringDisabledOptions = filterDisabled
    ? data.filter(filterDisabledOption)
    : data

  return filteringDisabledOptions
    .filter((service) => service.contexts.includes(context))
    .map(transformMetadataOption)
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

export {
  getMetadataOptions,
  getHeadquarterTypeOptions,
  getMetadataWithContextOptions,
}
