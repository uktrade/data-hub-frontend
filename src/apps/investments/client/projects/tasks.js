import axios from 'axios'

function handleError(error) {
  const message = error.response.data.detail
  return Promise.reject({
    message,
    ...error,
  })
}

function getProjects({ limit = 10, page, ...rest }) {
  let offset = limit * (parseInt(page, 10) - 1) || 0

  return axios
    .post('/api-proxy/v3/search/investment_project', {
      limit,
      offset,
      ...rest,
    })
    .then(({ data }) => data, handleError)
}

function getMetadataOptions(url) {
  return axios
    .get(url)
    .then(({ data }) =>
      data.map(({ id, name }) => ({ value: id, label: name }))
    )
}

function getSectorOptions(url, searchString) {
  return axios
    .get(url, {
      params: searchString ? { autocomplete: searchString } : {},
    })
    .then(({ data }) =>
      data
        .filter(({ level }) => level === 0)
        .map(({ id, name }) => ({ value: id, label: name }))
    )
}

function getAdviserNames(adviser) {
  if (!adviser) {
    return []
  }

  const advisers = Array.isArray(adviser) ? adviser : [adviser]

  return axios
    .all(advisers.map((adviser) => axios.get(`/api-proxy/adviser/${adviser}/`)))
    .then(
      axios.spread((...responses) =>
        responses.map(({ data }) => ({
          advisers: data,
        }))
      )
    )
}

function getMetadata(metadataOptions) {
  const optionCategories = Object.keys(metadataOptions)
  return Promise.all(
    optionCategories.map((name) =>
      name == 'sectorOptions'
        ? getSectorOptions(metadataOptions[name])
        : getMetadataOptions(metadataOptions[name])
    ),
    handleError
  ).then((results) =>
    Object.fromEntries(
      results.map((options, index) => [optionCategories[index], options])
    )
  )
}

export { getProjects, getAdviserNames, getMetadata }
