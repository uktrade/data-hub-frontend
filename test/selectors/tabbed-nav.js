module.exports = () => {
  const tabbedNavSelector = `[role="tablist"]`
  return {
    container: tabbedNavSelector,
    item: (number) => `${tabbedNavSelector} span:nth-child(${number}) button`,
    selected: `${tabbedNavSelector} button[aria-selected="true"]`,
    buttons: `${tabbedNavSelector} button`,
  }
}
