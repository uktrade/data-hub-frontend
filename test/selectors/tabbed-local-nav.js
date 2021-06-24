module.exports = () => {
  const tabbedLocalNavSelector = `[data-test="tabbedLocalNav"]`
  return {
    item: (number) => `${tabbedLocalNavSelector} ul li:nth-child(${number}) a`,
    selected: `${tabbedLocalNavSelector} a.govuk-tabs__tab--selected`,
    tabs: `${tabbedLocalNavSelector} a.govuk-tabs__tab`,
  }
}
