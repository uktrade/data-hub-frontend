module.exports = () => {
  const tabbedNavSelector = `[role="tablist"]`
  return {
    item: (number) => `${tabbedNavSelector} span:nth-child(${number}) button`,
  }
}
