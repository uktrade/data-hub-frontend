const { defineSupportCode } = require('cucumber')

defineSupportCode(({ setDefaultTimeout }) => {
  setDefaultTimeout(300000)
})

module.exports = {
  waitForConditionPollInterval: 500,
  waitForConditionTimeout: 5000,
}
