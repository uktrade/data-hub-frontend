const { defineSupportCode } = require('cucumber')

defineSupportCode(({ setDefaultTimeout }) => {
  setDefaultTimeout(300000)
})
