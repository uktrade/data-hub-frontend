module.exports = (dataTest) => {
  const containerSelector = `[data-test="${dataTest}"]`
  return {
    container: containerSelector,
    heading: `${containerSelector} h2`,
    editLink: `${containerSelector} a.c-details-container__action`,
  }
}
