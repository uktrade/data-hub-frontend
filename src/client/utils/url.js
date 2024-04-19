export const parseQueryString = (queryString) =>
  Object.fromEntries(new URLSearchParams(queryString).entries())

// TODO: Rename to locationToQSParams
export const getQueryParamsFromLocation = (location) =>
  parseQueryString(location.search)

export const locationToQSParamsWithPage = (location) => {
  const queryParams = parseQueryString(location.search)

  return {
    ...queryParams,
    page: parseInt(queryParams.page || 1, 10),
  }
}
