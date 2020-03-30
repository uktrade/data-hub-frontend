module.exports = () => {
  const tabbedNavSelector = `[role="tablist"]`
  return {
    container: tabbedNavSelector,
    item: (number) => `${tabbedNavSelector} button:nth-child(${number})`,
    selected: `${tabbedNavSelector} button[aria-selected="true"]`,
    buttons: `${tabbedNavSelector} button`,
  }
}
