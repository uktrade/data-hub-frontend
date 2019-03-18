module.exports = (dataAutoId) => {
  const containerSelector = `[data-auto-id="${dataAutoId}"]`
  return {
    container: containerSelector,
    heading: `${containerSelector} h2`,
    editLink: `${containerSelector} a.c-details-container__action`,
  }
}
